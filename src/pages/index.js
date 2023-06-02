import { Inter } from "next/font/google";
import RegisteredCourses from "@/components/RegisteredCourses";
import NextAssessments from "@/components/NextAssessments";
import AssessmentPerformance from "@/components/AssessmentPerformance";
import LearningRecommendations from "@/components/LearningRecommendations";
import process from "next/dist/build/webpack/loaders/resolve-url-loader/lib/postcss";

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
      <LearningRecommendations
        learningRecommendationData={data.learningRecommendationData}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

  const coursesRes = await fetch(`${baseUrl}/api/getCourses`);
  const courses = await coursesRes.json();

  const assessmentDataRes = await fetch(`${baseUrl}/api/getAssessments`);
  const assessmentData = await assessmentDataRes.json();

  const learningRecommendationDataRes = await fetch(
    `${baseUrl}/api/getLearningRecommendation`
  );
  const learningRecommendationData = await learningRecommendationDataRes.json();

  const assessmentPerformanceRes = await fetch(
    `${baseUrl}/api/getAssessmentPerformance`
  );
  const assessmentPerformance = await assessmentPerformanceRes.json();

  const data = {
    currentDate: currentDate,
    courses: courses,
    assessmentData: assessmentData,
    assessmentPerformance: assessmentPerformance,
    learningRecommendationData: learningRecommendationData,
  };

  // Pass data to the page via props
  return { props: { data } };
}
