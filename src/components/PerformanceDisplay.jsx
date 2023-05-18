import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";
import { useEffect, useState } from "react";
export default function PerformanceDisplay() {
  async function fetchData() {
    return await fetch("/api/getAssessmentResults");
  }

  const [assessmentResults, setAssessmentResults] = useState();
  const [testData, setTestData] = useState();

  useEffect(() => {
    fetchData()
      .then((response) => response.json())
      .then((res) => {
        console.log(res.data);
        //setAssessmentResults(res.data);
        setTestData({
          datasets: [
            {
              label: "You",
              data: res.data.map((result) => result[3]),
            },
            {
              label: "Course Average",
              data: res.data.map((result) => result[4]),
            },
          ],
          labels: res.data.map((result) => result[0]),
        });
      });
  }, []);

  /*const data2 = {
    datasets: [
      {
        label: "You",
        data: assessmentResults.map((result) => result[3]),
      },
      {
        label: "Course Average",
        data: assessmentResults.map((result) => result[4]),
      },
    ],
    labels: assessmentResults.map((result) => result[0]),
  };*/

  const data = {
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

  if (!testData) {
    return <div>Loading...</div>;
  }

  if (testData.length === 0) {
    return <div>No assessments</div>;
  }

  return (
    <div>
      <Line data={testData} style={{ width: "500px", height: "auto" }} />
    </div>
  );
}
