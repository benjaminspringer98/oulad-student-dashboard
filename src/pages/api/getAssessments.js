// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require('fs');
const initSqlJs = require('sql.js');

// TODO: remove dates when not needed?
// old constants for course start dates
/*const startDate2013B = new Date(2013, 1, 1)
const startDate2013J = new Date(2013, 9, 1)
const startDate2014B = new Date(2014, 1, 1)
const startDate2014J = new Date(2014, 9, 1)*/

// constants for course start dates
const startDate2013B = "2013-02-01"
const startDate2013J = "2013-10-01"
const startDate2014B = "2014-02-01"
const startDate2014J = "2014-10-01"

// setting current date
const currentDate = process.env.CURRENT_DATE
const idStudent = process.env.ID_STUDENT

const assessmentsQuery = `SELECT si.code_module, si.code_presentation, a.date FROM assessments a
INNER JOIN studentInfo si ON a.code_module = si.code_module AND a.code_presentation = si.code_presentation
WHERE si.id_student = ${idStudent} AND a.date >= '${currentDate}'
ORDER BY a.date ASC
LIMIT 2`

const oldQuery = `
    SELECT s.code_module, s.code_presentation, a.id_assessment, a.assessment_type, a.date, a.weight, sa.score
    FROM studentInfo s
    INNER JOIN courses c ON s.code_module = c.code_module AND s.code_presentation = c.code_presentation
    INNER JOIN assessments a ON s.code_module = a.code_module AND s.code_presentation = a.code_presentation
    INNER JOIN studentAssessment sa ON a.id_assessment = sa.id_assessment AND s.id_student = sa.id_student
    WHERE s.id_student = ${idStudent}
    ORDER BY s.code_module, s.code_presentation, a.id_assessment;
`;

// TODO: move to own module?
async function connectToDb() {
    const filebuffer = fs.readFileSync(process.env.DB_PATH);
    const SQL = await initSqlJs();
    const db = new SQL.Database(filebuffer);
    return db
}

export default function handler(req, res) {
    const db = connectToDb().then((db) => {
        const result = db.exec(assessmentsQuery)
        const iterator = result.values()
        const data = Array.from(iterator)

        console.log(data)
        const assessmentData = data[0].values

        console.log(`assessmentData = ${assessmentData}`)
        db.close()
        return res.status(200).json({ data : assessmentData })
    })

}



