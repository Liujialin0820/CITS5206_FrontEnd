# Frontend (Vue) – Exam System Demo

## Purpose

This is a **Vue-based demo frontend** originally built to test and debug the backend APIs developed with Django. The final production frontend is being developed separately by the dedicated frontend team.

The design of this demo site follows the **prototype discussed with the lecturer**, and it provides essential functionality for testing API endpoints and validating backend logic.

- **Primary use case**: Design APIs and test the Django backend implementation.  
- **Extended use case**: Can be further developed into a production-ready frontend, if required.  

---

## Features

1. **Exam Page (`/`)**
   - Input student information and exam information.
   - Start answering questions directly.
2. **Admin Dashboard**
   - Display statistics with charts and visualizations.
   - Create and manage questions.
   - Analyze student results and calculate question accuracy (correct rate) based on exam records.
   - Create and manage exams:
     - Exams are generated randomly from the question bank.
     - The teacher selects the question bank and the number of questions.
     - The system automatically generates the exam.
   - View student details, exam information, and results (e.g., pass/fail status).

---

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

## Workflow

The overall workflow of the system is as follows:

1. **Setup by Administrator**
   - Create an administrator account through Django admin.
   - Log in with the administrator account.
   - Create or import questions into the question bank.
   - Create exams by selecting questions from the bank.

2. **Exam Process for Students**
   - A student logs in by entering their personal information and the exam name.
   - The system retrieves the exam based on the input.
   - The student answers the questions through the frontend interface.

3. **Submission and Scoring**
   - The completed answers are submitted to the backend.
   - The backend automatically calculates the score and records the results.
   - Administrators can review statistics, question accuracy, and student pass/fail status in the dashboard.

This workflow allows the frontend and backend to work together seamlessly for creating, managing, and delivering exams.