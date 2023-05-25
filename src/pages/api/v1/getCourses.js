// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require("fs");
const initSqlJs = require("sql.js");

const currentDate = process.env.CURRENT_DATE;
const idStudent = process.env.ID_STUDENT;

const coursesQuery = `SELECT *
FROM studentRegistration
WHERE id_student = ${idStudent}
  AND (date_registration <= date('${currentDate}') 
  AND (date_unregistration > date('${currentDate}') OR date_unregistration IS NULL))
  AND date('${currentDate}') < (
  SELECT
    CASE c.code_presentation
            WHEN '2013B' THEN date('2013-02-01', '+' || c.module_presentation_length || ' days')
            WHEN '2013J' THEN date('2013-10-01', '+' || c.module_presentation_length || ' days')
            WHEN '2014B' THEN date('2014-02-01', '+' || c.module_presentation_length || ' days')
            WHEN '2014J' THEN date('2014-10-01', '+' || c.module_presentation_length || ' days')
        END AS module_end_date
    FROM courses c
  INNER JOIN studentRegistration sr
  ON sr.code_module = c.code_module AND sr.code_presentation = c.code_presentation
  WHERE sr.id_student = ${idStudent}
)`;

const oldCoursesQuery = `SELECT *
FROM studentRegistration
WHERE id_student = ${idStudent}
  AND (date_registration <= '${currentDate}' AND (date_unregistration > '${currentDate}' OR date_unregistration IS NULL));
`;

async function connectToDb() {
  const filebuffer = fs.readFileSync(process.env.DB_PATH);
  const SQL = await initSqlJs();
  const db = new SQL.Database(filebuffer);
  return db;
}

export default function handler(req, res) {
  const db = connectToDb().then((db) => {
    let courseData;
    const result = db.exec(coursesQuery);
    if (result.length !== 0) {
      const iterator = result.values();
      const data = Array.from(iterator);
      //console.log(`data = ${data}`);
      courseData = data[0].values;
    } else courseData = [];

    db.close();
    //console.log(`courseData = ${courseData}`);
    return res.status(200).json({ data: courseData });
  });
}
