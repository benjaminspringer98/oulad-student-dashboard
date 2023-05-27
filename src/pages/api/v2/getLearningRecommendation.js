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

  data.forEach((course) => {
    const courseObject = {
      code_module: course.course.code_module,
      code_presentation: course.course.code_presentation,
    };

    // get mean score of current student
    const studentMeanScore = getStudentMeanScore(
      course.course.assessments,
      studentId
    );

    // get ids of students who were >= 10% better than current student
    // first get all unique studentIds
    // TODO: uniqueStudents getStudentMeanScore calculated wrong mean, check if function works properly (means seem lower than when manually checking sqlite)
    const uniqueStudents = getUniqueStudentIds(
      course.course.assessments,
      studentId
    );
    console.log(`uniqueStudents length: ${uniqueStudents.length}`);

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
  });

  return data;
}

function getStudentMeanScore(assessments, studentId) {
  let assessmentScoresStudent = 0;
  let numberOfAssessments = assessments.length;

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
