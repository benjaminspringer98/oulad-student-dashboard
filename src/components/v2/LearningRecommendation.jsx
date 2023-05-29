import React, { useEffect, useState } from "react";

export default function LearningRecommendation() {
  async function fetchData() {
    return await fetch("/api/v2/getLearningRecommendation");
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
    return <div>No data</div>;
  }

  return (
    <div>
      {data.map((course) => (
        <div>
          <h3>
            Course: {`${course.code_module} ${course.code_presentation} `}
          </h3>
          <ul>
            {course.highestDifferencePairs.map((pair) => (
              <li>
                Students that are 10% better have on average{" "}
                {Math.round(pair.difference)} more interactions in VLE{" "}
                {pair.key}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
