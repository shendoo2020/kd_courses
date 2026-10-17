# KLZ Academy Workspace Context

## Project Overview
This repository contains **KLZ Academy** (KDCourses), a production-grade Course Management, Interactive Learning, and Enterprise B2B Platform inspired by Coursera and DeepLearning.AI.

- **Frontend (`frontend/`):** Next.js 14 App Router, React 18, TypeScript, Tailwind CSS, Lucide Icons, Monaco Editor (`@monaco-editor/react`), React Hook Form, `react-player`, `react-markdown`, `remark-gfm`, Web Speech API voice storytelling, and native Arabic (العربية) RTL internationalization.
- **Backend (`backend/`):** Node.js 20 LTS, Express.js REST API, TypeScript, JWT stateless authentication, bcryptjs, Stripe SDK, `pdf-lib`, `nodemailer`.
- **Database:** PostgreSQL 16 with Prisma ORM 5.22 (`backend/prisma/schema.prisma`).
- **DevOps & Production:** Ubuntu 24.04 LTS Server with Nginx (reverse proxy), PM2 (process manager), and GitHub Actions automated CI/CD pipeline (`.github/workflows/deploy.yml`).

## Key Directory Structure

### Frontend (`frontend/src/`)
*   `app/`: Next.js 14 App Router pages:
    *   `/`: Multi-level catalog with audience tiers (`K-12`, `Higher Ed`, `Professional`), delivery modes (`Self-Paced`, `Cohort`, `Hybrid`), search, and full Arabic RTL support.
    *   `/(auth)/login/` & `/(auth)/register/`: Role-based authentication with confirm password validation.
    *   `/(auth)/forgot-password/`: Password recovery flow sending temporary passwords via SMTP.
    *   `/courses/[id]/`: Public course details with transparent package inclusions/exclusions, schedule metrics, instructor credentials, promotional coupon input, and physical study pack home delivery modal.
    *   `/courses/[id]/learn/`: Interactive Classroom with 100vh mobile layout, stepper navigation, Web Speech AI narration, Monaco code execution sandbox, checkpoint quizzes, threaded Q&A drawer (`DiscussionDrawer`), and capstone project submission (`CapstoneSubmission`).
    *   `/custom-courses/`: Multi-step institutional and enterprise B2B custom course request wizard.
    *   `/events/`: Academic seminars and keynotes calendar with live seat reservations (RSVP).
    *   `/teach/`: Faculty and instructor onboarding and recruitment portal.
    *   `/about/`: Institutional mission, academic governance, and faculty review board.
    *   `/stories/`: Alumni wall of love, student testimonials, and verified certificate gallery.
    *   `/org/dashboard/`: B2B Enterprise team manager portal for license seat tracking, employee roster, and secure join codes.
    *   `/dashboard/`: Student enrolled courses and progress overview with clean state rendering.
    *   `/dashboard/profile/`: Profile editor, local image upload, theme toggle, change password, and verified certificate generation/download.
    *   `/admin/dashboard/`: Multi-tab operations control center for Courses, Custom Requests, Logistics Delivery, Faculty Applications, and Seminar Scheduling.
*   `components/`:
    *   `NotificationBell.tsx`: Real-time notification bell dropdown in header with unread count and deep links.
    *   `DiscussionDrawer.tsx`: In-classroom slide Q&A forum with threaded replies, upvotes, and instructor endorsement badges.
    *   `CodeSandbox.tsx`: Embedded Monaco Editor with code execution simulation and unit-test assertions.
    *   `CapstoneSubmission.tsx`: Capstone repository submission form and instructor grading history.
*   `lib/`:
    *   `api.ts`: Central Axios client with typed service helpers for Courses, Requests, Delivery, Events, Applications, Testimonials, Notifications, Comments, Projects, Coupons, and Orgs.
    *   `LanguageContext.tsx`: Global language state (`en` ⇋ `ar`), RTL direction switcher (`ltr` ⇋ `rtl`), and localStorage persistence.
    *   `translations.ts`: High-register bilingual dictionaries for English and Arabic.

### Backend (`backend/src/`)
*   `controllers/`:
    *   `authController.ts`: Registration, JWT login, profile updates, and temporary password reset.
    *   `courseController.ts`: Course catalog with multi-tier filters, syllabus details, and reviews.
    *   `classroomController.ts`: Module/lesson progress tracking and classroom syllabus retrieval.
    *   `commentController.ts`: Threaded Q&A questions, replies, upvotes, and instructor endorsements.
    *   `notificationController.ts`: In-app notification dispatch and read-state management.
    *   `projectController.ts`: Capstone project submissions and instructor grading.
    *   `couponController.ts`: Promotional coupon creation and checkout validation.
    *   `orgController.ts`: Enterprise B2B team organization, join codes, and manager analytics.
    *   `courseRequestController.ts`: Custom cohort requests and administrative status updates.
    *   `deliveryController.ts`: Door-to-door print order logistics and courier tracking codes.
    *   `eventController.ts`: Seminars, keynotes, and attendee RSVP management.
    *   `instructorAppController.ts`: Faculty recruitment pipeline and one-click account promotion.
    *   `testimonialController.ts`: Alumni reviews and social proof showcase.
    *   `paymentController.ts`: Stripe Checkout sessions and raw webhook verification.
    *   `certController.ts`: Dynamic PDF certificate generation via `pdf-lib`.
*   `routes/`: Express route definitions mounted in `app.ts`.
*   `middlewares/`: `authMiddleware.ts` (JWT verification and role guards) and `errorMiddleware.ts`.
*   `utils/`: `email.ts` (Nodemailer transporter for transactional emails / password recovery), `auth.ts`, `courseSeeder.ts`, `promptCourseSeeder.ts`.
*   `prisma/schema.prisma`: Comprehensive schema definitions for Users, Courses, Enrollments, Modules, Lessons, LessonProgress, Quizzes, QuizAttempts, Certificates, Reviews, Comments, CourseRequests, PrintOrders, Events, EventRegistrations, InstructorApplications, Testimonials, Notifications, ProjectSubmissions, Coupons, Organizations, and OrgMemberships.

## Development & Contribution Standards
*   **Production Quality:** NEVER use lazy placeholders like `// ... rest of code` or partial implementations.
*   **Design & Theme:** Adhere strictly to the KLZ Academy palette (`brand-600` primary blue, `slate-950` dark surfaces, `slate-50` subtle backgrounds) with complete Dark Mode and Arabic RTL support.
*   **Type Safety:** Adhere to strict TypeScript typing across all controllers, models, and UI components.
*   **CI/CD Pipeline:** Every push to `main` triggers `.github/workflows/deploy.yml`, which tests, migrates, builds, and deploys directly to the production server. Ensure local builds (`npm run build` in both `frontend` and `backend`) pass with zero errors before committing.

## Operational Lessons Learned & CLI Best Practices (LLCs)

1. **PowerShell vs Bash Command Chaining:**
   - In Windows PowerShell 5.1, `&&` is NOT a valid statement separator and causes `ParserError: The token '&&' is not a valid statement separator`.
   - **Correct syntax for PowerShell:** Use semicolon `;` between commands (e.g. `npm install; npm run build`).
   - In Linux/Bash, `&&` is standard.

2. **Quoting File Paths with Parentheses/Brackets:**
   - On Windows PowerShell, paths containing parentheses or brackets (e.g. `frontend/src/app/(auth)/login/page.tsx` or `[id]`) trigger subexpression parsing errors if unquoted.
   - **Always quote paths with single quotes:** `'frontend/src/app/courses/[id]/page.tsx'`.

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
   - Rather than installing a complex self-hosted Postfix SMTP server on Ubuntu, use standard SMTP environment variables (`SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`) compatible with free tiers of Resend (3,000 free emails/mo) or SendGrid (100 free emails/day).
   - In development environments without SMTP credentials, `email.ts` securely logs the temporary password to the console for frictionless testing.

6. **Next.js JSX Conditional Rendering:**
   - Deeply nested ternary expressions (`a ? b ? c : d : e ? f : g`) can cause SWC syntax errors during Next.js compilation.
   - Refactor UI states into clean, independent boolean guards (e.g., `{isLoading && (...)}`, `{!isLoading && error && (...)}`, `{!isLoading && !error && activeTab === '...' && (...)}`).
