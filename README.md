This is the Learning Analytics Dashboard (LAD) developed for the seminar
Learning Analytics and Educational Data Mining at the University of Goettingen, as part of the M.Sc. in Business Information Systems. 
It consists of a Web-App and a SQLite database with the Open University Learning Analytics Dataset (OULAD). 
As the database is too large to include here, setup instructions are provided below.


## Installation

### Prerequisites

- Node.js
- SQLite database with the data from the Open University Learning Analytics Dataset (OULAD)

#### Database setup

1. Download the OULAD as csv files from https://analyse.kmi.open.ac.uk/open_dataset
2. Import tables from csv files (DB Browser for SQLite recommended)
3. Set primary and foreign keys (see website above under "Database schema" for details)
4. Problem with SQL and table studentInfo: primary key id_student is not unique. 
Solution was to get all unique id’s, create a new table named student with those unique id’s, and have id_student as foreign key in studentInfo. 
SQL code for this: 
```
CREATE TABLE "studentInfo" (
	"code_module"	TEXT,
	"code_presentation"	TEXT,
	"id_student"	INTEGER,
	"gender"	TEXT,
	"region"	TEXT,
	"highest_education"	TEXT,
	"imd_band"	TEXT,
	"age_band"	TEXT,
	"num_of_prev_attempts"	INTEGER,
	"studied_credits"	INTEGER,
	"disability"	TEXT,
	"final_result"	TEXT,
	FOREIGN KEY("code_module") REFERENCES "courses"("code_module"),
	FOREIGN KEY("code_presentation") REFERENCES "courses"("code_presentation"),
	FOREIGN KEY("id_student") REFERENCES "student"
)

CREATE TABLE "student" (
	"id_student"	INTEGER,
	PRIMARY KEY("id_student")
)
INSERT INTO student SELECT DISTINCT id_student FROM studentInfo;
```
5. Rework all dates in DB from values relative to module start date (e.g. 43), which are really hard to work with, to absolute date format, e.g. 2013-12-04):
```
UPDATE assessments
SET date = (
    CASE code_presentation
        WHEN '2013B' THEN date('2013-02-01', '+' || date || ' days')
        WHEN '2013J' THEN date('2013-10-01', '+' || date || ' days')
        WHEN '2014B' THEN date('2014-02-01', '+' || date || ' days')
        WHEN '2014J' THEN date('2014-10-01', '+' || date || ' days')
    END
);
UPDATE studentVle
SET date = (
    CASE
        WHEN date < 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '-' || ABS(date) || ' days')
                WHEN '2013J' THEN date('2013-10-01', '-' || ABS(date) || ' days')
                WHEN '2014B' THEN date('2014-02-01', '-' || ABS(date) || ' days')
                WHEN '2014J' THEN date('2014-10-01', '-' || ABS(date) || ' days')
            END
        WHEN date >= 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '+' || date || ' days')
                WHEN '2013J' THEN date('2013-10-01', '+' || date || ' days')
                WHEN '2014B' THEN date('2014-02-01', '+' || date || ' days')
                WHEN '2014J' THEN date('2014-10-01', '+' || date || ' days')
            END
    END
);
UPDATE studentRegistration
SET date_registration = (
    CASE
        WHEN date_registration < 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '-' || ABS(date_registration) || ' days')
                WHEN '2013J' THEN date('2013-10-01', '-' || ABS(date_registration) || ' days')
                WHEN '2014B' THEN date('2014-02-01', '-' || ABS(date_registration) || ' days')
                WHEN '2014J' THEN date('2014-10-01', '-' || ABS(date_registration) || ' days')
            END
        WHEN date_registration >= 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '+' || date_registration || ' days')
                WHEN '2013J' THEN date('2013-10-01', '+' || date_registration || ' days')
                WHEN '2014B' THEN date('2014-02-01', '+' || date_registration || ' days')
                WHEN '2014J' THEN date('2014-10-01', '+' || date_registration || ' days')
            END
    END
),
date_unregistration = (
    CASE
        WHEN date_unregistration < 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '-' || ABS(date_unregistration) || ' days')
                WHEN '2013J' THEN date('2013-10-01', '-' || ABS(date_unregistration) || ' days')
                WHEN '2014B' THEN date('2014-02-01', '-' || ABS(date_unregistration) || ' days')
                WHEN '2014J' THEN date('2014-10-01', '-' || ABS(date_unregistration) || ' days')
            END
        WHEN date_unregistration >= 0 THEN
            CASE code_presentation
                WHEN '2013B' THEN date('2013-02-01', '+' || date_unregistration || ' days')
                WHEN '2013J' THEN date('2013-10-01', '+' || date_unregistration || ' days')
                WHEN '2014B' THEN date('2014-02-01', '+' || date_unregistration || ' days')
                WHEN '2014J' THEN date('2014-10-01', '+' || date_unregistration || ' days')
            END
    END
);
UPDATE studentAssessment
SET date_submitted = (
    CASE assessments.code_presentation
        WHEN '2013B' THEN date('2013-02-01', '+' || studentAssessment.date_submitted || ' days')
        WHEN '2013J' THEN date('2013-10-01', '+' || studentAssessment.date_submitted || ' days')
        WHEN '2014B' THEN date('2014-02-01', '+' || studentAssessment.date_submitted || ' days')
        WHEN '2014J' THEN date('2014-10-01', '+' || studentAssessment.date_submitted || ' days')
    END
)
FROM assessments
WHERE assessments.id_assessment = studentAssessment.id_assessment
AND assessments.code_module = (
    SELECT code_module FROM assessments WHERE assessments.id_assessment = studentAssessment.id_assessment
)
AND assessments.code_presentation = (
    SELECT code_presentation FROM assessments WHERE assessments.id_assessment = studentAssessment.id_assessment
);
```
6. OULAD Paper: „If the information about the final exam cut-off day is missing, it takes place during the last week of the module-presentation.“:
```
UPDATE assessments
SET date = CASE
    WHEN assessment_type = 'Exam' AND date IS NULL THEN
        CASE courses.code_presentation
            WHEN '2013B' THEN date('2013-02-01', '+' || courses.module_presentation_length || ' days')
            WHEN '2013J' THEN date('2013-10-01', '+' || courses.module_presentation_length || ' days')
            WHEN '2014B' THEN date('2014-02-01', '+' || courses.module_presentation_length || ' days')
            WHEN '2014J' THEN date('2014-10-01', '+' || courses.module_presentation_length || ' days')
        END
    ELSE date
END
FROM courses
WHERE courses.code_module = assessments.code_module AND courses.code_presentation = assessments.code_presentation;
```

### Running the app locally

#### Install dependencies
```bash
npm i
```

#### Setting environment variables

- create a file named `.env.local` in the root directory of the project:
```
NEXT_PUBLIC_CURRENT_DATE=<YYYY-MM-DD>
NEXT_PUBLIC_ID_STUDENT=<OULAD_STUDENT_ID>
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

- create a file named `.env` in the root directory of the project:
```
DATABASE_URL=<PATH_TO_SQLITE_DB>
```

#### Run the app
```bash
npm run dev
```

- open [http://localhost:3000](http://localhost:3000) with your browser to see the result.