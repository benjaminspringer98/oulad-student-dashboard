import { useEffect, useState } from "react";
import dateConstants from "@/utils/dates";

export default function Course({ course }) {
  // TODO: maybe write own hook to get date, if used frequently?
  const [currentDate, setCurrentDate] = useState();

  async function getCurrentDate() {
    return await fetch("/api/v2/getCurrentDate");
  }

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

    //console.log(`endDate: ${endDate}`);

    return endDate < today;
  }

  useEffect(() => {
    getCurrentDate()
      .then((response) => response.json())
      .then((res) => {
        //console.log(res)
        setCurrentDate(res.currentDate);
      });
  }, []);

  if (isModuleOver()) {
    return (
      <div className="block max-w-sm p-6 bg-gray-400 border border-gray-200 rounded-2xl shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Code Module: {course.code_module}
        </h5>
        <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Code Presentation: {course.code_presentation}
        </h6>
        <h6>Date registration: {course.date_registration}</h6>
        over
      </div>
    );
  } else {
    return (
      <div className="block max-w-sm p-6 bg-blue-200 border border-gray-200 rounded-2xl shadow">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Code Module: {course.code_module}
        </h5>
        <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white">
          Code Presentation: {course.code_presentation}
        </h6>
        <h6>Date registration: {course.date_registration}</h6>
        ongoing
      </div>
    );
  }
}
