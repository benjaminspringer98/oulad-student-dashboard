import React, { useEffect, useState } from "react";
import Course from "@/components/v2/Course";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";

const AssessmentPerformance = () => {
  async function fetchData() {
    return await fetch("/api/v2/getAssessmentPerformance");
  }

  function getAssessmentMeanScore(studentAssessment) {
    let sum = 0;
    let count = 0;
    studentAssessment.forEach((assessment) => {
      if (assessment.score !== null) {
        sum += assessment.score;
        count++;
      }
    });
    return sum / count;
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

  const testData2 = {
    datasets: [
      {
        label: "You",
        data: [20, 10, 34],
      },
      {
        label: "Course average",
        data: [40, 10, 40],
      },
    ],
    labels: ["Ass 1", "Ass 2", "Ass 3"],
  };

  const testData = {
    datasets: [
      {
        label: "You",
        data: [20, 10, 34],
      },
      {
        label: "Course average",
        data: [40, 10, 40],
      },
    ],
    labels: ["Ass 1", "Ass 2", "Ass 3", "4", "6"],
  };

  if (!data) {
    return <div>Loading...</div>;
  }

  if (data.length === 0) {
    return <div>No data</div>;
  }

  // TODO: is returning 0 the best option when student has not handed in assessment?
  // TODO: some exams have no grading, thus the mean score cant be calculated, should they be excluded from the chart?

  return (
    <div>
      Your performance:
      <ul className="flex">
        {data.map((course) => (
          <Line
            key={course.id}
            title="Title"
            options={{
              plugins: {
                title: {
                  display: true,
                  text: `${course.code_module} ${course.code_presentation}`,
                },
              },
            }}
            data={{
              datasets: [
                {
                  label: "You",
                  data: course.course.assessments.map((assessment) => {
                    const studentAssessment = assessment.studentAssessment.find(
                      (sa) =>
                        sa.id_student ===
                        Number(process.env.NEXT_PUBLIC_ID_STUDENT)
                    );
                    return studentAssessment ? studentAssessment.score : 0;
                  }),
                },
                {
                  label: "Course average",
                  data: course.course.assessments.map((assessment) =>
                    assessment.studentAssessment
                      ? getAssessmentMeanScore(assessment.studentAssessment)
                      : undefined
                  ),
                },
              ],
              labels: course.course.assessments.map(
                (assessment) => assessment.id_assessment
              ),
            }}
          />
        ))}
      </ul>
    </div>
  );

  /*return (
    <div>
      Your performance:
      <ul className="flex">
        {data.map((course) => (
          <li>
            Course: {`${course.code_module} ${course.code_presentation}`}
            {course.course.assessments.map((assessment) => (
              <div>
                Assessment: {assessment.id_assessment}
                <p>
                  Mean Score:
                  {getAssessmentMeanScore(assessment.studentAssessment)}
                </p>
                Your score:
                {assessment.studentAssessment.find(
                  (sa) =>
                    sa.id_student === Number(process.env.NEXT_PUBLIC_ID_STUDENT)
                )
                  ? assessment.studentAssessment.find(
                      (sa) =>
                        sa.id_student ===
                        Number(process.env.NEXT_PUBLIC_ID_STUDENT)
                    ).score
                  : "not handed in"}
              </div>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );*/
};

export default AssessmentPerformance;
