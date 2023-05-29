import { PrismaClient } from "@prisma/client";

const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

export default function handler(req, res) {
  const prism = getLearningRecommendation(
    Number(process.env.NEXT_PUBLIC_ID_STUDENT)
  );
  prism.then((data) => {
    return res.status(200).json({ data });
  });
}

async function getLearningRecommendation(studentId) {
  const prisma = new PrismaClient();
  const percentage = 0.1; // students who were >= 10% better

  const data = await prisma.studentRegistration.findMany({
    where: {
      AND: [
        {
          id_student: studentId,
        },
        {
          date_registration: {
            lte: currentDate,
          },
        },
        {
          OR: [
            {
              date_unregistration: {
                gt: currentDate,
              },
            },
            {
              date_unregistration: null,
            },
          ],
        },
      ],
    },
    include: {
      course: {
        include: {
          assessments: {
            where: {
              date: {
                lte: currentDate,
              },
            },
            include: {
              studentAssessment: true,
            },
          },
          studentVle: {
            where: {
              date: {
                lte: currentDate,
              },
            },
          },
        },
      },
    },
  });

  const learningRecommendationsForCourses = [];
  data.forEach((course) => {
    // get mean score of current student
    const studentMeanScore = getStudentMeanScore(
      course.course.assessments,
      studentId
    );

    // first get all unique studentIds
    const uniqueStudents = getUniqueStudentIds(
      course.course.assessments,
      studentId
    );
    console.log(`uniqueStudents length: ${uniqueStudents.length}`);

    // get ids of students who were >= percentage better than current student
    let studentsBetterThanCurrent = [];
    uniqueStudents.forEach((idStudent) => {
      const meanScore = getStudentMeanScore(
        course.course.assessments,
        idStudent
      );

      //console.log(`student ${idStudent} meanScore: ${meanScore}`);
      if (meanScore >= studentMeanScore * (1 + percentage)) {
        console.log(
          `student ${idStudent} with mean score ${meanScore} was at least 10% better than current student ${studentId} with mean score ${studentMeanScore}`
        );
        studentsBetterThanCurrent.push(idStudent);
      }
    });

    // get all vle mean interactions of students who were >= percentage better than current student
    // i.e. [{id_student: 1, vleInteractions: [{id_site: 1337, total_sum_clicks: 59} {id_site: 1338, total_sum_clicks: 33}], ...]
    const vleInteractionsByStudent = calculateVleInteractions(
      course.course.studentVle,
      studentsBetterThanCurrent
    );

    const currentStudentVleInteractions = calculateVleInteractions(
      course.course.studentVle,
      [studentId]
    );

    // TODO: hardest part: identify trends
    // maybe just get mean of vle interactions of other students for each id_site and
    // compare it to the current student's mean vle interactions for each id_site
    // where the difference is biggest, that's where the current student should focus on
    // This is to some extend already in getAssessmentVsVleInteraction.js
    // Problem: How will the mean be calculated, i.e. by what is divided?

    const learningRecommendationsForCourse = {
      code_module: course.course.code_module,
      code_presentation: course.course.code_presentation,
      vleInteractionsByStudent: vleInteractionsByStudent,
      currentStudentVleInteractions: currentStudentVleInteractions,
    };

    learningRecommendationsForCourses.push(learningRecommendationsForCourse);
  });

  return learningRecommendationsForCourses;
}

function calculateVleInteractions(studentVle, studentIds) {
  let output = [];

  const filteredStudentVle = studentVle.filter((vle) =>
    studentIds.includes(vle.id_student)
  );

  for (let entry of filteredStudentVle) {
    let id_student = entry.id_student;
    let id_site = entry.id_site;
    let sum_click = entry.sum_click;

    // Check if the student already exists in the output list
    let studentExists = false;
    for (let student of output) {
      if (student.id_student === id_student) {
        studentExists = true;
        let vleInteractions = student.vleInteractions;

        // Check if the vle_interaction with the same id_site already exists
        let vleInteractionExists = false;
        for (let vleInteraction of vleInteractions) {
          if (vleInteraction.id_site === id_site) {
            vleInteraction.total_sum_clicks += sum_click;
            vleInteractionExists = true;
            break;
          }
        }

        // If the vle_interaction doesn't exist, create a new one
        if (!vleInteractionExists) {
          vleInteractions.push({
            id_site: id_site,
            total_sum_clicks: sum_click,
          });
        }
        break;
      }
    }

    // If the student doesn't exist, create a new student entry
    if (!studentExists) {
      output.push({
        id_student: id_student,
        vleInteractions: [{ id_site: id_site, total_sum_clicks: sum_click }],
      });
    }
  }

  return output;
}

function getStudentMeanScore(assessments, studentId) {
  let assessmentScoresStudent = 0;

  // always divide by total number of course assessments, not by number of assessments that student has handed in
  let numberOfAssessments = assessments.filter(
    (a) => a.assessment_type !== "Exam" // exclude exam scores, as they are in studentInfo, not studentAssessment
  ).length;

  for (let i = 0; i < assessments.length; i++) {
    const assessment = assessments[i];
    const score = assessment.studentAssessment.find(
      (sa) => sa.id_student === studentId
    )
      ? assessment.studentAssessment.find((sa) => sa.id_student === studentId)
          .score
      : 0;

    //console.log(`adding assessmentScoreStudent of ${score}`);
    assessmentScoresStudent += score;
    //console.log(`total score is now ${assessmentScoresStudent}`);
  }

  const meanAssessmentScoreStudent =
    assessmentScoresStudent / numberOfAssessments;
  //console.log(`meanScoreAssessment: ${meanAssessmentScoreStudent}`);

  return meanAssessmentScoreStudent;
}

function getUniqueStudentIds(assessments, givenIdStudent) {
  const uniqueStudents = new Set();

  for (const assessment of assessments) {
    for (const studentAssessment of assessment.studentAssessment) {
      if (studentAssessment.id_student !== givenIdStudent) {
        uniqueStudents.add(studentAssessment.id_student);
      }
    }
  }

  return Array.from(uniqueStudents);
}
