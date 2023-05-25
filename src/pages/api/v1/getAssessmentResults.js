// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require("fs");
const initSqlJs = require("sql.js");

const currentDate = new Date(process.env.CURRENT_DATE);
const idStudent = process.env.ID_STUDENT;

const assessmentResultsQuery = `SELECT a.id_assessment, a.assessment_type, a.date AS assessment_date, sa.score,
       AVG(sa_other.score) AS average_score
FROM assessments AS a
JOIN studentAssessment AS sa ON a.id_assessment = sa.id_assessment
JOIN student AS s ON sa.id_student = s.id_student
JOIN studentAssessment AS sa_other ON sa.id_assessment = sa_other.id_assessment
WHERE s.id_student = ${idStudent}
  AND sa.date_submitted < '${currentDate}'
GROUP BY a.id_assessment, a.assessment_type, a.date, sa.score`;

async function connectToDb() {
  const filebuffer = fs.readFileSync(process.env.DB_PATH);
  const SQL = await initSqlJs();
  const db = new SQL.Database(filebuffer);
  return db;
}

export default function handler(req, res) {
  const db = connectToDb().then((db) => {
    const result = db.exec(assessmentResultsQuery);
    const iterator = result.values();
    const data = Array.from(iterator);

    const assessmentResultsData = data[0].values;
    db.close();
    return res.status(200).json({ data: assessmentResultsData });
  });
}
