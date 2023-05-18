// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require('fs');
const initSqlJs = require('sql.js');

// constants for course start dates
const startDate2013B = new Date(2013, 1, 1)
const startDate2013J = new Date(2013, 9, 1)
const startDate2014B = new Date(2014, 1, 1)
const startDate2014J = new Date(2014, 9, 1)

// setting current date
const currentDate = new Date(process.env.CURRENT_DATE)
const idStudent = process.env.ID_STUDENT
const date = 15

const oldQuery = `SELECT a.*
FROM assessments a
JOIN studentRegistration sr ON a.code_module = sr.code_module AND a.code_presentation = sr.code_presentation
LEFT JOIN studentAssessment sa ON a.id_assessment = sa.id_assessment AND sa.id_student = sr.id_student
WHERE sr.id_student = ${idStudent}
  AND [date] BETWEEN sr.date_registration AND COALESCE(sr.date_unregistration, [date])
  AND sa.id_assessment IS NULL`

const assessmentsQuery = `
    SELECT s.code_module, s.code_presentation, a.id_assessment, a.assessment_type, a.date, a.weight, sa.score
    FROM studentInfo s
    INNER JOIN courses c ON s.code_module = c.code_module AND s.code_presentation = c.code_presentation
    INNER JOIN assessments a ON s.code_module = a.code_module AND s.code_presentation = a.code_presentation
    INNER JOIN studentAssessment sa ON a.id_assessment = sa.id_assessment AND s.id_student = sa.id_student
    WHERE s.id_student = ${idStudent}
    ORDER BY s.code_module, s.code_presentation, a.id_assessment;
`;


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

        const assessmentData = data[0].values
        let relevantAssessments = []
        console.log(`assessmentData = ${assessmentData}`)

        assessmentData.forEach((assessment) => {
            // determine course start date
            let startDate
            switch(assessment[1]) {
                case "2013B":
                    startDate = startDate2013B
                    break
                case "2013J":
                    startDate = startDate2013J
                    break
                case "2014B":
                    startDate = startDate2014B
                    break
                case "2014J":
                    startDate = startDate2014J
                    break
            }

            const dueDate = getDueDate(startDate, Number(assessment[4]))
            assessment[4] = dueDate

            if(startDate <= currentDate && currentDate <= dueDate)
                relevantAssessments.push(assessment)

        })
        console.log(relevantAssessments)
        db.close()
        return res.status(200).json({ data : relevantAssessments })
    })

    function getDueDate(startDate, daysFromStart) {
        const due = new Date(startDate)
        due.setDate(due.getDate() + daysFromStart);
        return due
    }
}



