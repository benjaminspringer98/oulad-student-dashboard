import React, { useEffect, useState } from "react";
import Recommendation from "@/components/Recommendation";

export default function LearningRecommendations({
  learningRecommendationData,
}) {
  return (
    <div className="m-4">
      <h2 className="heading-tertiary">
        Students that have at least 10% better scores on average have:
      </h2>
      <div className="flex justify-center">
        {learningRecommendationData.learningRecommendationData.map((course) => (
          <div key={`${course.code_module} ${course.code_presentation}`}>
            <p className="text-center">{course.code_module}</p>
            {course.highestDifferencePairs.length !== 0 ? (
              course.highestDifferencePairs.map((pair) => (
                <Recommendation key={pair.key} pair={pair} />
              ))
            ) : (
              <div className="block text-center max-w-sm p-2 m-2 border bg-green-300 border-gray-200 rounded-2xl shadow">
                You are already among the best students, keep up the good work!
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
