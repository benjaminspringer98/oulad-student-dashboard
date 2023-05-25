import CourseCard from "@/components/CourseCard";
import { useEffect, useState } from "react";
import dateConstants from "../utils/dates";

export default function Courses() {
  const currentDate = dateConstants.currentDate;

  // get all courses
  async function fetchData() {
    return await fetch("/api/v1/getCourses");
  }

  const [courses, setCourses] = useState();

  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .then((res) => {
        //console.log(`courseData = ${res.data}`);
        setCourses(res.data);
      });
  }, []);

  if (!courses) {
    return <div>Loading...</div>;
  }

  if (courses.length === 0) {
    return <div>No courses</div>;
  }

  return (
    <div className="flex">
      {courses.map((course) => (
        <CourseCard course={course} key={`${course[0]} ${course[1]}`} />
      ))}
    </div>
  );
}
