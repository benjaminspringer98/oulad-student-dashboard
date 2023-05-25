import React, { useEffect, useState } from "react";
import { PrismaClient } from "@prisma/client";

const CoursesDisplay = () => {
  async function fetchData() {
    return await fetch("/api/v1/getAssessments");
  }

  const [assessments, setAssessments] = useState([]);

  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        setAssessments(res.data);
      });
  }, []);

  // Grouping the array elements based on the first element
  const groupedData = assessments.reduce((result, data) => {
    const key = data[0]; // First element as the key for grouping
    if (!result[key]) {
      result[key] = [];
    }
    result[key].push(data);
    return result;
  }, {});

  console.log(groupedData);

  if (!assessments) {
    return <div>Loading...</div>;
  }

  if (assessments.length === 0) {
    return <div>No assessments</div>;
  }

  return (
    <div className="flex">
      {Object.entries(groupedData).map(([key, data]) => (
        <div className="block max-w-sm p-6 bg-white border border-gray-200 rounded-2xl shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white"></h5>
          <h6 className="mb-2 text-xl tracking-tight text-gray-900 dark:text-white"></h6>

          <div key={key}>
            <h3>{key}</h3>
            Next assessments:
            <ul>
              {data.map((item, index) => (
                <li key={index}>{item.join(", ")}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CoursesDisplay;
