import Course from "@/components/v2/Course";

const RegisteredCourses = ({ courses }) => {
  return (
    <div className="m-4">
      <h2 className="heading-secondary">Your courses</h2>
      <ul className="flex">
        {courses.courses.map((course) => (
          <Course
            course={course}
            key={`${course.code_module} ${course.code_presentation}`}
          />
        ))}
      </ul>
    </div>
  );
};

export default RegisteredCourses;
