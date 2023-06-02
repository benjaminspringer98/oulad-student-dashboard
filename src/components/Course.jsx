import dateConstants from "@/utils/dates";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

export default function Course({ course }) {
  const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

  function isModuleOver() {
    let length = course.course.module_presentation_length;
    //console.log(`length: ${length}`);
    let startDate;
    switch (course.code_presentation) {
      case "2013B":
        startDate = new Date(dateConstants.startDate2013B);
        break;
      case "2013J":
        startDate = new Date(dateConstants.startDate2013J);
        break;
      case "2014B":
        startDate = new Date(dateConstants.startDate2014B);
        break;
      case "2014J":
        startDate = new Date(dateConstants.startDate2014J);
        break;
    }
    //console.log(`startDate: ${startDate}`);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + length);

    const today = new Date(currentDate);

    return endDate < today;
  }

  function getEndDate() {
    let length = course.course.module_presentation_length;
    //console.log(`length: ${length}`);
    let startDate;
    switch (course.code_presentation) {
      case "2013B":
        startDate = new Date(dateConstants.startDate2013B);
        break;
      case "2013J":
        startDate = new Date(dateConstants.startDate2013J);
        break;
      case "2014B":
        startDate = new Date(dateConstants.startDate2014B);
        break;
      case "2014J":
        startDate = new Date(dateConstants.startDate2014J);
        break;
    }
    //console.log(`startDate: ${startDate}`);
    let endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + length);

    return endDate.toLocaleDateString();
  }

  if (isModuleOver()) {
    return (
      <div className="course-over-card">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {course.code_module}
        </h5>
        <p>over</p>
      </div>
    );
  } else {
    return (
      <div className="course-ongoing-card">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {course.code_module}
        </h5>
        <p>ongoing</p>
        <p>until {getEndDate()}</p>
      </div>
    );
  }
}
