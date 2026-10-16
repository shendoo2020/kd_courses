# KLZ Academy Workspace Context

## Project Overview
This repository contains **KLZ Academy**, a production-grade Course Management and Interactive Learning Platform built with a decoupled architecture inspired by Coursera and DeepLearning.AI.

- **Frontend (`frontend/`):** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, React Hook Form, `react-player`.
- **Backend (`backend/`):** Node.js 20 LTS, Express.js REST API, TypeScript, JWT stateless authentication, bcryptjs, Stripe SDK, `pdf-lib`, `nodemailer`.
- **Database:** PostgreSQL 16 with Prisma ORM (`backend/prisma/schema.prisma`).
- **DevOps & Production:** Ubuntu 24.04 LTS Server with Nginx (reverse proxy), PM2 (process manager), and GitHub Actions automated CI/CD pipeline (`.github/workflows/deploy.yml`).

## Key Directory Structure
*   `frontend/src/app/`: Next.js 14 App Router pages:
    *   `/`: Catalog landing page with search, categories, and price filters.
    *   `/(auth)/login/` & `/(auth)/register/`: Role-based authentication with confirm password validation.
    *   `/(auth)/forgot-password/`: Password recovery flow sending temporary passwords via email.
    *   `/courses/[id]/`: Public course details with syllabus, reviews, and dynamic CTA ("Start Now" vs "Continue Learning").
    *   `/courses/[id]/learn/`: Interactive Classroom with 100vh mobile layout, next/prev lesson buttons, video player, reading labs, persistent checkpoint quizzes, and progress tracking.
    *   `/dashboard/`: Student enrolled courses and progress overview with clean state rendering.
    *   `/dashboard/profile/`: Public profile editor, avatar gallery, theme toggles, change password form, and gated certificate generator/download.
    *   `/admin/dashboard/`: Instructor portal and course listing.
    *   `/admin/courses/new/`: Course creation wizard.
    *   `/admin/courses/[id]/edit/`: Curriculum & syllabus builder with quiz authoring.
*   `backend/src/`: Express REST API:
    *   `controllers/`: Business logic for Auth (including forgot/change password), Courses, Reviews, Classroom, Quizzes, Stripe, Certificates (joyful & professional PDF generation), and Users.
    *   `routes/`: Modular Express route definitions with JWT protection and role enforcement.
    *   `middlewares/`: `authMiddleware.ts` (JWT verification and role guards) and `errorMiddleware.ts`.
    *   `utils/`: `email.ts` (Nodemailer transporter for transactional emails / password recovery), `auth.ts`, `courseSeeder.ts`.
    *   `prisma/schema.prisma`: Schema definitions for Users, Courses, Enrollments, Modules, Lessons, LessonProgress, Quizzes, Questions, Options, QuizAttempts, Certificates, and Reviews.

## Development & Contribution Standards
*   **Production Quality:** NEVER use lazy placeholders like `// ... rest of code` or partial implementations.
*   **Design & Theme:** Adhere strictly to the KLZ Academy palette (`brand-600` primary blue, `slate-950` dark surfaces, `slate-50` subtle backgrounds) with complete Dark Mode support.
*   **Type Safety:** Adhere to strict TypeScript typing across all controllers, models, and UI components.
*   **CI/CD Pipeline:** Every push to `main` triggers `.github/workflows/deploy.yml`, which tests, migrates, builds, and deploys directly to the production server. Ensure local builds (`npm run build` in both `frontend` and `backend`) pass with zero errors before committing.

## Operational Lessons Learned & CLI Best Practices (LLCs)

1. **PowerShell vs Bash Command Chaining:**
   - In Windows PowerShell 5.1, `&&` is NOT a valid statement separator and causes `ParserError: The token '&&' is not a valid statement separator`.
   - **Correct syntax for PowerShell:** Use semicolon `;` between commands (e.g. `npm install; npm run build`).
   - In Linux/Bash, `&&` is standard.

2. **Quoting File Paths with Parentheses/Brackets:**
   - On Windows PowerShell, paths containing parentheses or brackets (e.g. `frontend/src/app/(auth)/login/page.tsx` or `[id]`) trigger subexpression parsing errors if unquoted.
   - **Always quote paths with single quotes:** `'frontend/src/app/(auth)/login/page.tsx'`.

3. **Git Push in Non-Interactive / Headless Environments:**
   - When tools or CLI wrappers pass `credential.helper=`, running `git push` fails with `fatal: could not read Username for 'https://github.com': terminal prompts disabled`.
   - **Solution:** Pass the system credential helper explicitly in the command:
     `git -c credential.helper=wincred push origin main`

4. **Prisma Schema Generation vs Database Push:**
   - `npx prisma db push` connects directly to PostgreSQL. If the local database service is offline, it fails with error `P1001: Can't reach database server at localhost:5432`.
   - To update Prisma Client and TypeScript definitions locally without running PostgreSQL, run:
     `npx prisma generate`
   - `npx prisma db push` will execute on the remote production server during the CI/CD pipeline deployment.

5. **Nodemailer & Transactional Email Strategy:**
   - Rather than installing a complex self-hosted Postfix SMTP server on Ubuntu (which requires strict SPF, DKIM, DMARC DNS records to avoid spam filters), use standard SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) compatible with free tiers of Resend (3,000 free emails/mo) or SendGrid (100 free emails/day).
   - In development environments without SMTP credentials, `email.ts` securely logs the temporary password to the console for frictionless testing.

6. **Next.js JSX Conditional Rendering:**
   - Deeply nested ternary expressions (`a ? b ? c : d : e ? f : g`) can cause SWC syntax errors during Next.js compilation.
   - Refactor UI states into clean, independent boolean guards (e.g., `{isLoading && (...)}`, `{!isLoading && error && (...)}`, `{!isLoading && !error && activeTab === '...' && (...)}`).
