# 🎓 KLZ Academy

> **KLZ Academy** is a modern, production-grade Course Management and Interactive Learning Platform inspired by Coursera and DeepLearning.AI. It features video lectures, reading labs, automated checkpoint quizzes, Stripe payments, verifiable PDF certificates, student reviews, role-based auth, email recovery, and an instructor curriculum builder.

[![Deploy to Ubuntu Server](https://github.com/shendoo2020/kd_courses/actions/workflows/deploy.yml/badge.svg)](https://github.com/shendoo2020/kd_courses/actions/workflows/deploy.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-14.1.3-black.svg)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue.svg)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22.0-indigo.svg)](https://www.prisma.io/)

---

## 📑 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Repository Structure](#-repository-structure)
- [Prerequisites](#-prerequisites)
- [Local Development Setup](#-local-development-setup)
  - [1. Database Setup](#1-database-setup)
  - [2. Backend Setup](#2-backend-setup)
  - [3. Frontend Setup](#3-frontend-setup)
- [Environment Variables](#-environment-variables)
- [Database Schema & Prisma](#-database-schema--prisma)
- [API Reference](#-api-reference)
- [Production Deployment & CI/CD](#-production-deployment--cicd)
- [Operational Lessons Learned & CLI Tips (LLCs)](#-operational-lessons-learned--cli-tips-llcs)
- [Contributing & Code Standards](#-contributing--code-standards)

---

## 🏛 Architecture Overview

KLZ Academy is engineered as a decoupled monorepo architecture:

```
┌────────────────────────────────────────────────────────┐
│                   Client (Browser)                     │
└───────────────────────────┬────────────────────────────┘
                            │
              HTTP / HTTPS (:80 / :443)
                            ▼
┌────────────────────────────────────────────────────────┐
│                   Nginx Reverse Proxy                  │
├───────────────────────────┬────────────────────────────┤
│   Requests to /           │   Requests to /api/*       │
│   (Port 3000)             │   (Port 5000)              │
└─────────────┬─────────────┴─────────────┬──────────────┘
              ▼                           ▼
┌───────────────────────────┐ ┌───────────────────────────┐
│     Next.js 14 App        │ │    Express.js Node API    │
│  (React 18 / Tailwind)    │ │   (TypeScript / JWT Auth) │
└───────────────────────────┘ └─────────────┬─────────────┘
                                            │
                                  Prisma ORM (Port 5432)
                                            ▼
                              ┌───────────────────────────┐
                              │    PostgreSQL Database    │
                              └───────────────────────────┘
```

---

## ✨ Key Features

### For Students & Learners
- **Multi-Level Educational Pathways:** Multi-tier academic catalog navigating across *Schools (K-12)*, *Universities & Colleges*, and *Professional & Enterprise Training*, with delivery mode filters (*Self-Paced, Live Cohort, Hybrid*).
- **Native Arabic (العربية) & RTL Support:** Seamless right-to-left UI layout with custom Cairo Google Font typography and instant bilingual toggle.
- **In-Browser Coding Sandboxes:** Monaco Editor (`@monaco-editor/react`) integration embedded into lessons with test assertions and syntax support.
- **Classroom Q&A Forum Drawer:** Threaded slide discussions, answer upvoting, and instructor endorsement badges.
- **In-App Notification Center:** Global notification bell with unread badge alerts for replies, grades, and event invites.
- **Capstone Project Submissions:** GitHub repository / PDF deliverable submission with instructor feedback and status tracking.
- **Physical Material Home Delivery:** Door-to-door print ordering for spiral summary booklets, lecture notes, and gold-foil certificates with courier tracking.
- **Seminars & Keynotes Calendar:** Community events and live webinars with complimentary seat reservations (RSVP).
- **Promotional Coupons & Regional Checkout:** Coupon discount validation during checkout with flexible deductions.
- **Interactive Classroom:** Fullscreen mobile-optimized layout (100vh), step-by-step navigation, AI voice storytelling, video lectures, and technical labs.
- **Knowledge Checkpoints (Quizzes):** Persistent assessments with instant scoring and pass-rate recording.
- **Joyful & Verifiable PDF Certificates:** Strict download gating with tamper-proof cryptographic UUID verification at `/verify/[certId]`.
- **Student Profile, Avatar & Settings:** Avatar gallery, local image upload with canvas resizing, dark/light theme switchers, and password reset.

### For Institutions & Enterprises
- **B2B Custom Course Requests:** On-demand cohort inquiry system (`/custom-courses`) with admin proposal review.
- **Enterprise Team Manager Portal (`/org/dashboard`):** Multi-seat license usage graphs, employee roster, progress tracking, and secure join codes.

### For Instructors & Admins
- **Operations Control Center (`/admin/dashboard`):** Multi-tab triage for Curriculum, Custom Inquiries, Logistics Delivery Orders, Faculty Candidates, and Seminars.
- **Faculty Recruitment Funnel (`/teach`):** Vetted application pipeline with one-click instructor account approval.
- **Curriculum & Syllabus Builder (`/admin/courses/[id]/edit`):** Module organizer, video/article editor, and quiz builder.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [React Hook Form](https://react-hook-form.com/), `react-player` |
| **Backend** | [Node.js 20 LTS](https://nodejs.org/), [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [JWT](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js), [Nodemailer](https://nodemailer.com/) |
| **Database** | [PostgreSQL 16](https://www.postgresql.org/), [Prisma ORM](https://www.prisma.io/) |
| **Payments & Media** | [Stripe SDK](https://stripe.com/), [pdf-lib](https://pdf-lib.js.org/) |
| **DevOps & Infra** | Ubuntu 24.04 LTS Server, Nginx, PM2, GitHub Actions (CI/CD) |

---

## 📁 Repository Structure

```text
KDCourses/
├── .github/
│   └── workflows/
│       └── deploy.yml            # Automated GitHub Actions CI/CD pipeline
├── backend/
│   ├── prisma/
│   │   └── schema.prisma         # Data models (Users, Courses, Modules, Lessons, etc.)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.ts             # Prisma client singleton
│   │   ├── controllers/
│   │   │   ├── authController.ts # Register, Login, Forgot & Change Password
│   │   │   ├── certController.ts # Gated joyful PDF certificate generator
│   │   │   ├── classroomController.ts # Module, lesson, completion & progress engine
│   │   │   ├── courseController.ts # Catalog, course details, review engine
│   │   │   ├── enrollController.ts # Student enrollment & dashboard sync
│   │   │   ├── paymentController.ts# Stripe Checkout & Webhook handler
│   │   │   └── quizController.ts   # Quiz submission & grading
│   │   ├── middlewares/
│   │   │   ├── authMiddleware.ts # JWT token verification & role enforcement
│   │   │   └── errorMiddleware.ts# Centralized error handler
│   │   ├── routes/
│   │   │   ├── authRoutes.ts
│   │   │   ├── certRoutes.ts
│   │   │   ├── classroomRoutes.ts
│   │   │   ├── courseRoutes.ts
│   │   │   ├── enrollRoutes.ts
│   │   │   ├── paymentRoutes.ts
│   │   │   ├── quizRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── utils/
│   │   │   ├── auth.ts           # Token issuance & password hashing
│   │   │   ├── email.ts          # Nodemailer SMTP transporter
│   │   │   └── courseSeeder.ts   # Interactive onboarding course seeder
│   │   ├── app.ts                # Express application bootstrapping
│   │   └── server.ts             # Entry point (port listener)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx           # Sign-in with temp password handler
│   │   │   │   ├── register/page.tsx        # Registration with confirm password
│   │   │   │   └── forgot-password/page.tsx # Password recovery form
│   │   │   ├── admin/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── [id]/edit/page.tsx   # Curriculum / Quiz builder
│   │   │   │   │   └── new/page.tsx         # Course creation form
│   │   │   │   ├── dashboard/page.tsx       # Instructor portal
│   │   │   │   └── layout.tsx               # Admin sidebar layout
│   │   │   ├── courses/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── learn/page.tsx       # Interactive Classroom UI (100vh mobile)
│   │   │   │   │   └── page.tsx             # Course Details & dynamic CTAs
│   │   │   ├── dashboard/
│   │   │   │   ├── profile/page.tsx         # Avatar picker, theme, passwords & certs
│   │   │   │   └── page.tsx                 # Student learning dashboard
│   │   │   ├── globals.css                  # Tailwind base directives
│   │   │   ├── layout.tsx                   # Global header, theme & avatar dropdown
│   │   │   └── page.tsx                     # Main Catalog with search & filters
│   │   └── lib/
│   │       ├── api.ts            # Axios instance with auto-injected JWT
│   │       └── utils.ts          # Tailwind class merger
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docs/                         # Architecture, Security, & Deployment guides
├── GEMINI.md                     # Agentic CLI workspace context & LLCs
└── README.md                     # Main developer documentation
```

---

## 🛠 Prerequisites

- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **PostgreSQL:** v15 or v16
- **Git**

---

## 🚀 Local Development Setup

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432`:
```bash
psql -U postgres -c "CREATE DATABASE kdcourses_dev;"
```

### 2. Backend Setup
```bash
cd backend
npm install
```

**`backend/.env`**:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:password@localhost:5432/kdcourses_dev?schema=public"
JWT_SECRET="local_development_jwt_secret_key"
STRIPE_SECRET_KEY="sk_test_mock_or_your_stripe_test_key"
STRIPE_WEBHOOK_SECRET="whsec_mock"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Optional SMTP settings for transactional emails (defaults to terminal logging in dev)
SMTP_HOST="smtp.resend.com"
SMTP_PORT=587
SMTP_USER="resend"
SMTP_PASS="re_your_api_key"
SMTP_FROM='"KLZ Academy Support" <support@yourdomain.com>'
```

```bash
# Push database schema & generate client
npx prisma db push
npx prisma generate

# Start dev server
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```

**`frontend/.env.local`**:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🔐 Environment Variables

| Variable | Location | Description |
| :--- | :--- | :--- |
| `PORT` | `backend/.env` | Express server port (default: `5000`) |
| `NODE_ENV` | `backend/.env` | `development` or `production` |
| `DATABASE_URL` | `backend/.env` | PostgreSQL connection string with credentials |
| `JWT_SECRET` | `backend/.env` | Secret string for signing authentication tokens |
| `STRIPE_SECRET_KEY` | `backend/.env` | Stripe private API key (`sk_live_...` or `sk_test_...`) |
| `STRIPE_WEBHOOK_SECRET` | `backend/.env` | Stripe signing secret for webhook verification |
| `NEXT_PUBLIC_APP_URL` | `backend/.env` | Base URL of frontend for Stripe redirects |
| `SMTP_HOST` | `backend/.env` | SMTP host for email delivery (e.g. `smtp.resend.com`) |
| `SMTP_PORT` | `backend/.env` | SMTP port (e.g. `587` or `465`) |
| `SMTP_USER` | `backend/.env` | SMTP username |
| `SMTP_PASS` | `backend/.env` | SMTP password / API token |
| `SMTP_FROM` | `backend/.env` | Sender address (e.g. `"Support" <support@domain.com>`) |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Public API endpoint (e.g. `http://localhost:5000/api` or `http://84.235.239.86/api`) |

---

## 🗄 Database Schema & Prisma

The schema handles the entire learning lifecycle:
- **`User`**: Supports `Role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`), avatars, bios, and `isTemporaryPassword` flag.
- **`Course`**: Categorized course records linked to instructors.
- **`Enrollment`**: Unique composite constraint on `[studentId, courseId]` with `ACTIVE` and `COMPLETED` statuses.
- **`Module`**: Sequential course sections.
- **`Lesson`**: Video lectures and article text readings.
- **`LessonProgress`**: Tracks student completion status per lesson.
- **`Quiz` & `Question` & `Option`**: Multiple-choice assessment engine.
- **`QuizAttempt`**: Records student scores and passing grades.
- **`Certificate`**: Records verified course achievements.
- **`Review`**: 1-5 star ratings and student feedback.

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create account (validates name, email, password) | Public |
| `POST` | `/api/auth/login` | Sign in and receive JWT token + temp password flag | Public |
| `POST` | `/api/auth/forgot-password` | Issue and dispatch temporary password via email | Public |
| `POST` | `/api/auth/change-password` | Update account password | Authenticated |

### Courses & Catalog (`/api/courses`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/courses` | Fetch courses (Query: `?search=`, `?category=`, `?priceType=`) | Public |
| `GET` | `/api/courses/:id` | Fetch detailed course with syllabus & reviews | Public |
| `POST` | `/api/courses` | Create new course | Instructor / Admin |
| `POST` | `/api/courses/:id/reviews` | Submit 1–5 star review | Enrolled Student |

### Classroom & Curriculum (`/api/classroom`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/classroom/:courseId` | Fetch modules, lessons & personalized student progress | Enrolled Student |
| `POST` | `/api/classroom/:courseId/modules` | Add module to course | Instructor |
| `POST` | `/api/classroom/modules/:moduleId/lessons` | Add video/text lesson or quiz | Instructor |
| `POST` | `/api/classroom/lessons/:lessonId/progress` | Mark lesson complete & auto-completes enrollment | Enrolled Student |

### Certificates (`/api/certificates`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates/:courseId` | Generate 100% gated dynamic PDF certificate | Enrolled Student |
| `GET` | `/api/certificates/verify/:certId` | Verify authenticity of minted certificate | Public |

---

## 🚢 Production Deployment & CI/CD

KLZ Academy includes a fully automated **GitHub Actions** deployment pipeline (`.github/workflows/deploy.yml`).

### How It Works:
1. Every commit pushed to the `main` branch triggers the GitHub Actions runner.
2. The runner connects to the production Ubuntu server via SSH using secrets configured in GitHub.
3. It performs a zero-downtime update:
   - Fetches and hard-resets to the latest commit.
   - Updates backend packages, generates Prisma Client, and runs `prisma db push`.
   - Compiles TypeScript and builds the Next.js production bundle.
   - Restarts PM2 processes (`kdcourses-api` and `kdcourses-web`).
   - Reloads Nginx.

---

## 🛠 Operational Lessons Learned & CLI Tips (LLCs)

1. **PowerShell vs Bash Command Chaining:**
   - In Windows PowerShell 5.1, `&&` causes syntax errors. Always use `;` between commands:
     `npm install; npm run build`
2. **Quoting Paths with Parentheses/Brackets:**
   - Always wrap file paths containing `(auth)` or `[id]` in single quotes when passing to `git` or CLI tools:
     `git add 'frontend/src/app/(auth)/login/page.tsx'`
3. **Git Push in Headless / Non-Interactive CLIs:**
   - If Git fails with `terminal prompts disabled` due to cleared credential helpers, specify the Windows Credential Manager:
     `git -c credential.helper=wincred push origin main`
4. **Prisma Client Generation without Database:**
   - To update TypeScript definitions locally without running PostgreSQL, run `npx prisma generate` instead of `prisma db push`.
5. **Nodemailer / SMTP Best Practices:**
   - Avoid self-hosted Postfix servers due to strict email spam filtering (missing PTR/DKIM). Use transactional services like Resend or SendGrid via standard SMTP environment variables.
6. **Next.js JSX Conditional Syntax:**
   - Avoid deeply nested ternaries inside JSX templates. Use explicit boolean guards (`{condition && <Component />}`) to guarantee clean compilation with SWC.

---

## 🤝 Contributing & Code Standards

- **TypeScript Strictness:** Strict typing across all endpoints and components.
- **Component Styling:** Utility-first Tailwind CSS following the KLZ Academy palette (`brand-600`, `slate-950`).
- **No Placeholders:** Code must always be production-ready without lazy placeholders.
- **Build Verification:** Ensure `npm run build` succeeds in both `backend` and `frontend` before pushing to `main`.
