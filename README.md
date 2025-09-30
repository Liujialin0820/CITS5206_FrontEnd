# Frontend (Vue) – Exam System Demo

This is a **Vue-based demo frontend** originally built to test and debug the backend APIs developed with Django.  
Although the frontend can be further optimized and deployed as a standalone product, its main purpose was to support backend development.  
The final production frontend is being developed separately by the dedicated frontend team.

The design of this demo site follows the **prototype discussed with the lecturer**, and it provides essential functionality for testing API endpoints and validating backend logic.

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

## Purpose

- **Primary use case**: Design APIs and test the Django backend implementation.  
- **Extended use case**: Can be further developed into a production-ready frontend, if required.  

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

This frontend must be used **together with the backend**.   