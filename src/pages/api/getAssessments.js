const fs = require("fs");
const initSqlJs = require("sql.js");

const currentDate = process.env.CURRENT_DATE;
const idStudent = process.env.ID_STUDENT;

const coursesQuery = `SELECT id_student
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

const assessmentsQuery = `SELECT si.code_module, si.code_presentation, a.date, a.id_assessment, a.assessment_type FROM assessments a
INNER JOIN studentInfo si ON a.code_module = si.code_module AND a.code_presentation = si.code_presentation
WHERE si.id_student IN (${coursesQuery}) AND a.date >= '${currentDate}'
ORDER BY a.date ASC`;

const oldQuery = `SELECT si.code_module, si.code_presentation, a.date, a.id_assessment, a.assessment_type FROM assessments a
INNER JOIN studentInfo si ON a.code_module = si.code_module AND a.code_presentation = si.code_presentation
WHERE si.id_student = ${idStudent} AND a.date >= '${currentDate}'
ORDER BY a.date ASC`;

// TODO: move to own module?
async function connectToDb() {
  const filebuffer = fs.readFileSync(process.env.DB_PATH);
  const SQL = await initSqlJs();
  const db = new SQL.Database(filebuffer);
  return db;
}

export default function handler(req, res) {
  const db = connectToDb().then((db) => {
    let assessmentData;
    const result = db.exec(assessmentsQuery);
    if (result.length !== 0) {
      const iterator = result.values();
      const data = Array.from(iterator);
      assessmentData = data[0].values;
    } else assessmentData = [];

    //console.log(`assessmentData = ${assessmentData}`);
    db.close();
    return res.status(200).json({ data: assessmentData });
  });
}
