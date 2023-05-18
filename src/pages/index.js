import {Inter} from 'next/font/google'
import {useEffect, useState} from "react";
import Courses from "@/components/Courses";
import Assessments from "@/components/Assessments";

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
    const [date, setDate]  = useState()

    async function getCurrentDate() {
        return await fetch("/api/getCurrentDate")
    }

    useEffect(() => {
        getCurrentDate().then(response => response.json()).then(res => {
            console.log(res)
            setDate(res.currentDate)
        });
    }, []);


    return (
      <div>
        <h1 className="font-bold">Hello, User. Today is {date}</h1>
        <h2>My courses:</h2>
        <Courses/>
        <h2>My assessments:</h2>
        <Assessments/>
      </div>



  );
}


