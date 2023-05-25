import { Inter } from "next/font/google";
import { useEffect, useState } from "react";
import Courses from "@/components/Courses";
import Assessments from "@/components/Assessments";
import PerformanceDisplay from "@/components/PerformanceDisplay";
import CoursesDisplay from "@/components/CoursesDisplay";
import RegisteredCourses from "@/components/v2/RegisteredCourses";
import NextAssessments from "@/components/v2/NextAssessments";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const [date, setDate] = useState();

  async function getCurrentDate() {
    return await fetch("/api/v2/getCurrentDate");
  }

  useEffect(() => {
    getCurrentDate()
      .then((response) => response.json())
      .then((res) => {
        //console.log(res)
        setDate(res.currentDate);
      });
  }, []);

  return (
    <div>
      <h1 className="font-bold">Hello, User. Today is {date}</h1>
      <RegisteredCourses />
      <NextAssessments />
      {/*<h2>My courses:</h2>
      <Courses />
       <h2>Next assessments:</h2>
      <Assessments />
      <h2>Performance in previous assessments:</h2>
      <PerformanceDisplay />

      <CoursesDisplay></CoursesDisplay>*/}
    </div>
  );
}
