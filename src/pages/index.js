import { Inter } from "next/font/google";
import RegisteredCourses from "@/components/v2/RegisteredCourses";
import NextAssessments from "@/components/v2/NextAssessments";
import AssessmentPerformance from "@/components/v2/AssessmentPerformance";
import LearningRecommendation from "@/components/v2/LearningRecommendation";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";
import assessmentPerformance from "@/components/v2/AssessmentPerformance";

const inter = Inter({ subsets: ["latin"] });

export default function Home({ data }) {
  function getCurrentDateString() {
    const today = new Date(data.currentDate);
    return today.toLocaleDateString();
  }

  return (
    <div>
      <h1 className="heading-primary">
        Hello, User. Today is {getCurrentDateString()}
      </h1>
      <div className="flex justify-center flex-col sm:flex-row">
        <RegisteredCourses courses={data.courses} />
        <NextAssessments assessmentData={data.assessmentData} />
      </div>
      <AssessmentPerformance
        assessmentPerformance={data.assessmentPerformance}
      />
      {/*  <LearningRecommendation />*/}
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

  const coursesRes = await fetch(`${baseUrl}/api/v2/getCourses`);
  const courses = await coursesRes.json();

  const assessmentDataRes = await fetch(`${baseUrl}/api/v2/getAssessments`);
  const assessmentData = await assessmentDataRes.json();

  const assessmentPerformanceRes = await fetch(
    `${baseUrl}/api/v2/getAssessmentPerformance`
  );
  const assessmentPerformance = await assessmentPerformanceRes.json();

  const data = {
    currentDate: currentDate,
    courses: courses,
    assessmentData: assessmentData,
    assessmentPerformance: assessmentPerformance,
  };

  // Pass data to the page via props
  return { props: { data } };
}
