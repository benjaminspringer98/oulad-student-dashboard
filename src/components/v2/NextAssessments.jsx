import React, { useEffect, useState } from "react";
import Course from "@/components/v2/Course";

const NextAssessments = () => {
  async function fetchData() {
    return await fetch("/api/v2/getAssessments");
  }

  const [data, setData] = useState();

  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  }, []);

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No courses</div>;
  }

  return (
    <div>
      Next assessments:
      <ul className="flex">
        {data.map((course) => (
          <li>
            Course: {`${course.code_module} ${course.code_presentation}`}
            {course.course.assessments.map((assessment) => (
              <div>
                <p>
                  {assessment.id_assessment}, {assessment.date},{" "}
                  {assessment.assessment_type}
                </p>
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NextAssessments;
