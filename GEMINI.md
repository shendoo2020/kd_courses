# KLZ Academy Workspace Context

## Project Overview
This repository contains **KLZ Academy**, a production-grade Course Management and Interactive Learning Platform built with a decoupled architecture inspired by Coursera and DeepLearning.AI.

- **Frontend (`frontend/`):** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, React Hook Form, `react-player`.
- **Backend (`backend/`):** Node.js 20 LTS, Express.js REST API, TypeScript, JWT stateless authentication, bcryptjs, Stripe SDK, `pdf-lib`.
- **Database:** PostgreSQL 16 with Prisma ORM (`backend/prisma/schema.prisma`).
- **DevOps & Production:** Ubuntu 24.04 LTS Server with Nginx (reverse proxy), PM2 (process manager), and GitHub Actions automated CI/CD pipeline (`.github/workflows/deploy.yml`).

## Key Directory Structure
*   `frontend/src/app/`: Next.js 14 App Router pages:
    *   `/`: Catalog landing page with search, categories, and price filters.
    *   `/(auth)/login/` & `/(auth)/register/`: Role-based authentication.
    *   `/courses/[id]/`: Public course details with syllabus, reviews, and Stripe checkout.
    *   `/courses/[id]/learn/`: Interactive Classroom with video player, reading labs, checkpoint quizzes, and progress tracking.
    *   `/dashboard/`: Student enrolled courses and progress overview.
    *   `/dashboard/profile/`: Public profile editor and certificate generator/download.
    *   `/admin/dashboard/`: Instructor portal and course listing.
    *   `/admin/courses/new/`: Course creation wizard.
    *   `/admin/courses/[id]/edit/`: Curriculum & syllabus builder with quiz authoring.
*   `backend/src/`: Express REST API:
    *   `controllers/`: Business logic for Auth, Courses, Reviews, Classroom, Quizzes, Stripe, Certificates, and Users.
    *   `routes/`: Modular Express route definitions with JWT protection and role enforcement.
    *   `middlewares/`: `authMiddleware.ts` (JWT verification and role guards) and `errorMiddleware.ts`.
    *   `prisma/schema.prisma`: Schema definitions for Users, Courses, Enrollments, Modules, Lessons, LessonProgress, Quizzes, Questions, Options, QuizAttempts, Certificates, and Reviews.

## Development & Contribution Standards
*   **Production Quality:** NEVER use lazy placeholders like `// ... rest of code` or partial implementations.
*   **Design & Theme:** Adhere strictly to the KLZ Academy palette (`brand-600` primary blue, `slate-950` dark surfaces, `slate-50` subtle backgrounds).
*   **Type Safety:** Adhere to strict TypeScript typing across all controllers, models, and UI components.
*   **CI/CD Pipeline:** Every push to `main` triggers `.github/workflows/deploy.yml`, which tests, migrates, builds, and deploys directly to the production server. Ensure local builds (`npm run build` in both `frontend` and `backend`) pass with zero errors before committing.
