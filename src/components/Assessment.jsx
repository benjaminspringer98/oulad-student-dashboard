const Assessment = ({ assessment }) => {
  const currentDate = process.env.NEXT_PUBLIC_CURRENT_DATE;

  function getDaysUntilAssessment() {
    const assessmentDate = new Date(assessment.date);
    const today = new Date(currentDate);
    const timeDifference = assessmentDate.getTime() - today.getTime();
    const daysDifference = timeDifference / (1000 * 3600 * 24);
    return Math.ceil(daysDifference);
  }

  function assessmentInfo(assessment) {
    return (
      <p>
        {assessment.code_module} {assessment.assessment_type}
      </p>
    );
  }

  // TODO: add different text, when assessment is due today

  if (getDaysUntilAssessment(assessment.date) >= 15) {
    return (
      <div className="assessment-card bg-blue-200">
        {assessmentInfo(assessment)}
        <p>due in {getDaysUntilAssessment()} days</p>
      </div>
    );
  } else if (getDaysUntilAssessment(assessment.date) >= 7) {
    return (
      <div className="assessment-card bg-green-300">
        {assessmentInfo(assessment)}
        <p>due in {getDaysUntilAssessment()} days</p>
      </div>
    );
  } else if (getDaysUntilAssessment(assessment.date) >= 3) {
    return (
      <div className="assessment-card bg-orange-300">
        {assessmentInfo(assessment)}
        <p>due in {getDaysUntilAssessment()} days</p>
      </div>
    );
  } else if (getDaysUntilAssessment(assessment.date) > 0) {
    return (
      <div className="assessment-card bg-red-300">
        {assessmentInfo(assessment)}
        <p>due in {getDaysUntilAssessment()} days</p>
      </div>
    );
  } else {
    return (
      <div className="assessment-card bg-red-400">
        {assessmentInfo(assessment)}
        <p>due today!</p>
      </div>
    );
  }
};

export default Assessment;
