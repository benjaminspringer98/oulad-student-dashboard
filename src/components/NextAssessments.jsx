import Assessment from "@/components/Assessment";

const NextAssessments = ({ assessmentData }) => {
  return (
    <div className="m-4">
      <h2 className="heading-secondary">Next assessments</h2>
      <div className="flex">
        {assessmentData.assessmentData.map((course) => (
          <div key={`${course.code_module} ${course.code_presentation}`}>
            {course.course.assessments.map((assessment) => (
              <Assessment
                assessment={assessment}
                key={assessment.id_assessment}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextAssessments;
