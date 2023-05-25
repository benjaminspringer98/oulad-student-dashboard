import React, { useEffect, useState } from "react";
import Course from "@/components/v2/Course";

const RegisteredCourses = () => {
  async function fetchData() {
    return await fetch("/api/v2/getCourses");
  }

  const [courses, setCourses] = useState();

  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .then((res) => {
        //console.log(res.data);
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
    <div>
      Your courses:
      <ul className="flex">
        {courses.map((course) => (
          <Course
            course={course}
            key={`${course.code_module} ${course.code_presentation}`}
          />
        ))}
      </ul>
    </div>
  );
};

export default RegisteredCourses;
