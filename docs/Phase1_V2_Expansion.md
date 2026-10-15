# Phase 1: Architecture & Tech Stack Definition (V2 Expansion)

**Author:** [Lead System Architect]
**Project:** KDCourses - V2 Feature Expansion

## 1. System Architecture: The V2 Expansion

To transform KDCourses into a fully functional, monetizable learning platform (comparable to Coursera), we are expanding our decoupled architecture to support deeply nested learning content, automated assessments, and secure payment processing.

### Data Relationship Architecture
We are shifting from a flat `Course` model to a structured learning hierarchy:
*   **Course** -> contains many **Modules** (e.g., "Week 1", "Week 2").
*   **Module** -> contains many **Lessons** (Video/Text) AND/OR **Quizzes**.
*   **User Progress** -> tracks `LessonProgress` (boolean) and `QuizAttempt` (score).
*   **Certificates** -> Generated dynamically when `LessonProgress` == 100% and all quizzes are passed.

### Tech Stack Additions (Backend)
*   **Stripe SDK (`stripe`):** To generate secure Stripe Checkout Sessions and handle asynchronous webhooks for payment verification before granting an `Enrollment` record.
*   **PDF Generation (`pdf-lib`):** To dynamically construct Certificates of Completion using a base template and overlaying the student's name, course name, and completion date.
*   **Raw Body Parsing:** Required exclusively for the Stripe Webhook route to cryptographically verify signatures.

### Tech Stack Additions (Frontend)
*   **Video Player (`react-player`):** To handle robust video playback for lessons (supporting YouTube, Vimeo, or raw MP4s).
*   **Context API / Zustand (Optional):** We will rely on React Context or prop-drilling for the Student Classroom view to manage the deeply nested state (Course -> Module -> Lesson -> Progress).

## 2. Updated Directory Structure (Diff)

```text
KDCourses/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── paymentController.ts    <-- Stripe Checkout & Webhooks
│   │   │   ├── classroomController.ts  <-- Fetching modules, lessons, marking progress
│   │   │   └── certController.ts       <-- PDF Generation logic
│   │   └── routes/
│   │       ├── paymentRoutes.ts
│   │       ├── classroomRoutes.ts
│   │       └── certRoutes.ts
│
└── frontend/
    └── src/
        ├── app/
        │   ├── (auth)/                 <-- NEW: Dedicated UI
        │   │   ├── login/page.tsx
        │   │   └── register/page.tsx
        │   ├── dashboard/
        │   │   └── profile/page.tsx    <-- NEW: User Profile editing
        │   └── courses/
        │       └── [id]/
        │           └── learn/page.tsx  <-- NEW: The Interactive Classroom UI
        └── components/
            └── classroom/              <-- NEW: VideoPlayer, QuizEngine, Sidebar
```