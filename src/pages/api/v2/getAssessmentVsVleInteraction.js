import { PrismaClient } from "@prisma/client";
import assessmentPerformance from "@/components/v2/AssessmentPerformance";

const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;
export default function handler(req, res) {
  const prism = getAssessmentPerformance(
    Number(process.env.NEXT_PUBLIC_ID_STUDENT)
  );
  prism.then((data) => {
    return res.status(200).json({ data });
  });
}

async function getAssessmentPerformance(studentId) {
  const prisma = new PrismaClient();

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

  const assessmentVsVleByCourse = [];
  data.forEach((course) => {
    const courseObject = {
      code_module: course.course.code_module,
      code_presentation: course.course.code_presentation,
      vleInteraction: [],
    };

    courseObject.vleInteraction = calculateMeanSumClick(
      course.course.studentVle,
      studentId
    );
    assessmentVsVleByCourse.push(courseObject);
  });

  console.log(assessmentVsVleByCourse);

  return assessmentVsVleByCourse;
}

/*function calculateMeanSumClick(array) {
  const sums = {};
  const counts = {};
  const output = [];

  // Calculate the sum and count for each id_site
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    const id_site = obj.id_site;
    const sum_click = obj.sum_click;

    if (sums[id_site] === undefined) {
      sums[id_site] = 0;
      counts[id_site] = 0;
    }

    sums[id_site] += sum_click;
    counts[id_site]++;
  }

  // Calculate the mean and create the output array
  for (const id_site in sums) {
    const mean = sums[id_site] / counts[id_site];
    output.push({ id_site: parseInt(id_site), mean_sum_click: mean });
  }

  return output;
}*/

function calculateMeanSumClick(array, studentId) {
  const sums = {};
  const counts = {};
  const studentSums = {};
  const studentCounts = {};
  const output = [];

  // Calculate the sum and count for each id_site and id_student
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    const id_site = obj.id_site;
    const id_student = obj.id_student;
    const sum_click = obj.sum_click;

    if (sums[id_site] === undefined) {
      sums[id_site] = 0;
      counts[id_site] = 0;
    }

    sums[id_site] += sum_click;
    counts[id_site]++;

    if (studentSums[id_site] === undefined) {
      studentSums[id_site] = 0;
      studentCounts[id_site] = 0;
    }

    if (id_student === studentId) {
      studentSums[id_site] += sum_click;
      studentCounts[id_site]++;
    }
  }

  // Calculate the mean for each id_site and create the output array
  for (const id_site in sums) {
    const mean = sums[id_site] / counts[id_site];
    const mean_student = studentSums[id_site] / studentCounts[id_site] || 0;

    output.push({
      id_site: parseInt(id_site),
      mean_sum_click: mean,
      mean_sum_click_student: mean_student,
    });
  }

  return output;
}
