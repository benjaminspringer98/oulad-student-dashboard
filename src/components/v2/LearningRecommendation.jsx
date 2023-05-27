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
}
