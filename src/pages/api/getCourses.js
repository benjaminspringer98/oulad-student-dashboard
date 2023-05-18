// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const fs = require('fs');
const initSqlJs = require('sql.js');

const startDate2013B = new Date(2013, 1, 1)
const startDate2013J = new Date(2013, 9, 1)
const startDate2014B = new Date(2014, 1, 1)
const startDate2014J = new Date(2014, 9, 1)

// setting current date
const currentDate = new Date(process.env.CURRENT_DATE)
const idStudent = process.env.ID_STUDENT

const coursesQuery = `select c.code_module, c.code_presentation, c.module_presentation_length from courses c inner join studentInfo si on c.code_module = si.code_module and c.code_presentation = si.code_presentation where si.id_student = ${idStudent}`

async function connectToDb() {
  const filebuffer = fs.readFileSync(process.env.DB_PATH);
  const SQL = await initSqlJs();
  const db = new SQL.Database(filebuffer);
  return db
}

export default function handler(req, res) {
   const db = connectToDb().then((db) => {
     const result = db.exec(coursesQuery)
     const iterator = result.values()
     const data = Array.from(iterator)

     const courseData = data[0].values
     console.log(`courseData = ${courseData}`)
     console.log(`currentDate = ${currentDate}`)

     let relevantCourses = []
     courseData.forEach((course) => {
       // determine course start date
       let startDate
       switch(course[1]) {
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
         console.log(`startDate = ${startDate}`)
       const endDate = getEndDate(startDate, course[2])
       console.log(`endDate = ${endDate}`)

       // only return courses that are currently taking place
       if(startDate <= currentDate && currentDate <= endDate)
         relevantCourses.push(course)
     })
     console.log(relevantCourses)
     db.close()
     return res.status(200).json({ data : relevantCourses })
   })

  function getEndDate(startDate, moduleLength) {
     //console.log(`startDate = ${startDate}`)
     //console.log(`moduleLength = ${moduleLength}`)
     const end = new Date(startDate)
     end.setDate(end.getDate() + moduleLength);
     //console.log(`endDate = ${end}`)
     return end
  }
}



