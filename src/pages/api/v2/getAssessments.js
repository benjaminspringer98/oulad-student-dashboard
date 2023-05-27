import { PrismaClient } from "@prisma/client";

const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;
export default function handler(req, res) {
  const prism = getAssessments(Number(process.env.NEXT_PUBLIC_ID_STUDENT));
  prism.then((data) => {
    return res.status(200).json({ data });
  });
}

async function getAssessments(studentId) {
  const prisma = new PrismaClient();

  const assessments = await prisma.studentRegistration.findMany({
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
            take: 1,
            where: {
              date: {
                gte: currentDate,
              },
            },
            include: {
              studentAssessment: {
                where: {
                  id_student: studentId,
                },
              },
            },
          },
        },
      },
    },
  });

  return assessments;
}
