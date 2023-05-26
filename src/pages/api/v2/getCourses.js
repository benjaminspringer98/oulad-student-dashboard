import { PrismaClient } from "@prisma/client";

const currentDate = process.env.CURRENT_DATE;
export default function handler(req, res) {
  const prism = getRegisteredCourses(
    Number(process.env.NEXT_PUBLIC_ID_STUDENT)
  );
  prism.then((data) => {
    return res.status(200).json({ data });
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
