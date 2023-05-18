export default function CourseCard({course}) {
return (

    <div
       className="block max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{course[0]}</h5>
        <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">{course[1]}</h6>

    </div>

)
}