import React, { useEffect, useState } from "react";
import Course from "@/components/v2/Course";
import { Chart as ChartJS } from "chart.js/auto";
import { Bar, Chart, Line } from "react-chartjs-2";

const AssessmentVsVleInteraction = () => {
  async function fetchData() {
    return await fetch("/api/v2/getAssessmentVsVleInteraction");
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
      Your VLE commitment:
      <ul className="flex">
        {data.map((course) => (
          <Bar
            key={course.id}
            title="Title"
            options={{
              responsive: true,
              scales: {
                x: {
                  stacked: true,
                  title: {
                    display: true,
                    text: "VLE ID",
                  },
                  ticks: {
                    font: {
                      size: 10,
                    },
                  },
                },
                y: {
                  stacked: false,
                  title: {
                    display: true,
                    text: "Mean actions until today",
                  },
                },
              },
              indexAxis: "x",
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
                  data: course.vleInteraction.map(
                    (vleInteraction) => vleInteraction.mean_sum_click_student
                  ),
                },
                {
                  label: "Course average",
                  data: course.vleInteraction.map(
                    (vleInteraction) => vleInteraction.mean_sum_click
                  ),
                },
              ],
              labels: course.vleInteraction.map(
                (vleInteraction) => vleInteraction.id_site
              ),
            }}
          />
        ))}
      </ul>
    </div>
  );
};

export default AssessmentVsVleInteraction;
