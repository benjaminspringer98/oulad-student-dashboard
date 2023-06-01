import { PrismaClient } from "@prisma/client";

const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;
export default function handler(req, res) {
  const prism = getAssessmentPerformance(
    Number(process.env.NEXT_PUBLIC_ID_STUDENT)
  );
  prism.then((assessmentPerformance) => {
    return res.status(200).json({ assessmentPerformance });
  });
}

async function getAssessmentPerformance(studentId) {
  const prisma = new PrismaClient();

  const assessmentPerformance = await prisma.studentRegistration.findMany({
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
          /*studentVle: true,*/
        },
      },
    },
  });

  return assessmentPerformance;
}
