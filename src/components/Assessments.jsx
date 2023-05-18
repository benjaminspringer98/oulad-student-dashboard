import CourseCard from "@/components/CourseCard";
import AssessmentCard from "@/components/AssessmentCard";
import {useEffect, useState} from "react";

export default function Assessments() {
    async function fetchData() {
        return await fetch("/api/getAssessments")
    }

    const [assessments, setAssessments] = useState();

    useEffect(() => {
        fetchData().then(response => response.json()).then(res => {
            //console.log(data.data[0]);
            setAssessments(res.data)
        });
    }, []);

    if (!assessments) {
        return <div>Loading...</div>;
    }

    if (assessments.length === 0) {
        return <div>No assessments</div>
    }

    return (
        <div className="flex">
            {assessments.map((assessment) =>
                <AssessmentCard assessment={assessment}/>
            )}
        </div>
    )
}