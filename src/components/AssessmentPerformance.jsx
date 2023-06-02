import React, { useEffect, useState } from "react";
import { Chart as ChartJS } from "chart.js/auto";
import { Chart, Line } from "react-chartjs-2";

const AssessmentPerformance = ({ assessmentPerformance }) => {
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

  // TODO: is returning undefined the best option when student has not handed in assessment? leaves empty spaces in graph

  return (
    <div>
      <h2 className="heading-secondary">Your performance</h2>
      <div className="flex justify-center flex-col sm:flex-row">
        {assessmentPerformance.assessmentPerformance.map((course) => (
          <div
            key={`${course.code_module} ${course.code_presentation}`}
            className="w-60 h-60 md:w-72 md:h-72 lg:w-80 lg:h-80 m-4"
          >
            <Line
              key={course.id}
              title="Title"
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  x: {
                    title: {
                      display: true,
                      text: "Assessment ID",
                    },
                  },
                  y: {
                    beginAtZero: true,
                    suggestedMax: 100,
                    title: {
                      display: true,
                      text: "Score",
                    },
                  },
                },
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
                    borderColor: "#FFB0C1",
                    backgroundColor: "#FFB0C1",
                    data: course.course.assessments.map((assessment) => {
                      const studentAssessment =
                        assessment.studentAssessment.find(
                          (sa) =>
                            sa.id_student ===
                            Number(process.env.NEXT_PUBLIC_ID_STUDENT)
                        );
                      return studentAssessment
                        ? studentAssessment.score
                        : undefined;
                    }),
                  },
                  {
                    label: "Course average",
                    borderColor: "#93C5FD",
                    backgroundColor: "#93C5FD",
                    data: course.course.assessments.map((assessment) =>
                      assessment.studentAssessment
                        ? getAssessmentMeanScore(assessment.studentAssessment)
                        : undefined
                    ),
                  },
                ],
                labels: course.course.assessments.map((assessment) =>
                  assessment.assessment_type === "Exam"
                    ? "Exam"
                    : assessment.id_assessment
                ),
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AssessmentPerformance;
