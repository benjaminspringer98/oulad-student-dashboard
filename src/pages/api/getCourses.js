import { PrismaClient } from "@prisma/client";

const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

export default function handler(req, res) {
  const prism = getRegisteredCourses(
    Number(process.env.NEXT_PUBLIC_ID_STUDENT)
  );
  prism.then((courses) => {
    return res.status(200).json({ courses });
  });
}

async function getRegisteredCourses(studentId) {
  const prisma = new PrismaClient();

  const registeredCourses = await prisma.studentRegistration.findMany({
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
      course: true,
    },
  });

  /*  const registeredCourses = await prisma.studentRegistration.findMany({
    where: {
      AND: [
        {
          id_student: studentId,
        },
        {
          date_registration: {
            lte: currentDate,
          },
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
      course: true,
    },
  });*/

  return registeredCourses;
}
