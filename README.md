# 🎓 KLZ Academy

> **KLZ Academy** is a modern, production-grade Course Management and Interactive Learning Platform inspired by Coursera and DeepLearning.AI. It features video lectures, reading labs, automated checkpoint quizzes, Stripe payments, verifiable PDF certificates, student reviews, and an instructor curriculum builder.

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

### For Students
- **Course Discovery & Filtering:** Real-time search with instant category filters (*Development, Data Science, Business, Design, Cybersecurity*) and price toggles (*Free vs. Paid*).
- **Course Details:** Full syllabus preview, instructor biographies, ratings, and course reviews.
- **Stripe Checkout Integration:** One-click redirection to Stripe Checkout for secure credit card purchases. Free courses enroll instantly.
- **Interactive Classroom:** Coursera-style curriculum sidebar, dynamic video lecture player (`react-player`), and formatted reading materials.
- **Knowledge Checkpoints (Quizzes):** Interactive multiple-choice assessments with immediate scoring and progress updates.
- **Progress Tracking:** Automatic lecture completion and syllabus checkmarks.
- **Verifiable PDF Certificates:** Dynamic, cryptographic client-side download of completion certificates generated on the fly via `pdf-lib`.
- **Student Reviews & Ratings:** 1 to 5 star rating submission with community feedback.
- **Student Profile:** Bio editing and certificate trophy case.

### For Instructors & Admins
- **Instructor Portal (`/admin/dashboard`):** Overview of published courses and student enrollment counts.
- **Course Creator (`/admin/courses/new`):** Rich form for course metadata, pricing, category classification, and initial syllabus.
- **Curriculum & Syllabus Builder (`/admin/courses/[id]/edit`):** Drag-and-drop-style builder to create Modules, add Video/Article Lessons, and attach Multiple-Choice Quizzes.

---

## 💻 Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | [Next.js 14](https://nextjs.org/) (App Router), [React 18](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Tailwind CSS](https://tailwindcss.com/), [Lucide Icons](https://lucide.dev/), [React Hook Form](https://react-hook-form.com/), `react-player` |
| **Backend** | [Node.js 20 LTS](https://nodejs.org/), [Express.js](https://expressjs.com/), [TypeScript](https://www.typescriptlang.org/), [JWT](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) |
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
│   │   │   ├── authController.ts # Register & Login
│   │   │   ├── certController.ts # Dynamic PDF certificate generator
│   │   │   ├── classroomController.ts # Module, lesson & progress engine
│   │   │   ├── courseController.ts # Catalog, course details, review engine
│   │   │   ├── enrollController.ts # Student enrollment & dashboard
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
│   │   │   └── auth.ts           # Token issuance & password hashing
│   │   ├── app.ts                # Express application bootstrapping
│   │   └── server.ts             # Entry point (port listener)
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx     # Student & Instructor sign-in
│   │   │   │   └── register/page.tsx  # Account registration
│   │   │   ├── admin/
│   │   │   │   ├── courses/
│   │   │   │   │   ├── [id]/edit/page.tsx # Curriculum / Quiz builder
│   │   │   │   │   └── new/page.tsx       # Course creation form
│   │   │   │   ├── dashboard/page.tsx     # Instructor portal
│   │   │   │   └── layout.tsx             # Admin sidebar layout
│   │   │   ├── courses/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── learn/page.tsx     # Interactive Classroom UI
│   │   │   │   │   └── page.tsx           # Course Details, Stripe & Reviews
│   │   │   ├── dashboard/
│   │   │   │   ├── profile/page.tsx       # Profile editor & Certificate list
│   │   │   │   └── page.tsx               # Student learning dashboard
│   │   │   ├── globals.css                # Tailwind base directives
│   │   │   ├── layout.tsx                 # Global header & academic footer
│   │   │   └── page.tsx                   # Main Catalog with search & filters
│   │   └── lib/
│   │       ├── api.ts            # Axios instance with auto-injected JWT
│   │       └── utils.ts          # Tailwind class merger
│   ├── package.json
│   ├── tailwind.config.ts
│   └── tsconfig.json
│
├── docs/                         # Architecture, Security, & Deployment guides
├── GEMINI.md                     # Agentic CLI workspace context
└── README.md                     # Main developer documentation
```

---

## 🛠 Prerequisites

Make sure you have installed on your local development machine:
- **Node.js:** v20.x or higher
- **npm:** v10.x or higher
- **PostgreSQL:** v15 or v16
- **Git**

---

## 🚀 Local Development Setup

### 1. Database Setup
Ensure PostgreSQL is running locally on port `5432`:
```bash
# Example via psql
psql -U postgres -c "CREATE DATABASE kdcourses_dev;"
```

### 2. Backend Setup
```bash
# Navigate to the backend directory
cd backend

# Install dependencies
npm install

# Create local environment configuration
# Copy the template below into backend/.env
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
```

```bash
# Synchronize database schema and generate Prisma client
npx prisma db push
npx prisma generate

# Start development server with hot-reloading
npm run dev
```
The backend API is now running at `http://localhost:5000`.

### 3. Frontend Setup
Open a separate terminal window:
```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies
npm install
```

Create a **`frontend/.env.local`** file:
```env
NEXT_PUBLIC_API_URL="http://localhost:5000/api"
```

```bash
# Start Next.js development server
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
| `STRIPE_WEBHOOK_SECRET` | `backend/.env` | Stripe signing secret for raw webhook verification |
| `NEXT_PUBLIC_APP_URL` | `backend/.env` | Base URL of frontend for Stripe redirects |
| `NEXT_PUBLIC_API_URL` | `frontend/.env.local` | Public API endpoint (e.g. `http://localhost:5000/api` or `http://84.235.239.86/api`) |

---

## 🗄 Database Schema & Prisma

The schema handles the entire learning lifecycle:
- **`User`**: Supports `Role` (`STUDENT`, `INSTRUCTOR`, `ADMIN`), biographies, and avatars.
- **`Course`**: Categorized course records linked to instructors.
- **`Enrollment`**: Unique composite constraint on `[studentId, courseId]` preventing double-purchases.
- **`Module`**: Sequential course sections (e.g., Week 1, Chapter 2).
- **`Lesson`**: Video lectures (URLs) and article text readings.
- **`LessonProgress`**: Tracks student completion status per lesson.
- **`Quiz` & `Question` & `Option`**: Multiple-choice assessment engine.
- **`QuizAttempt`**: Records student scores and passing grades.
- **`Certificate`**: Records completed course achievements.
- **`Review`**: 1-5 star ratings and written student feedback.

### Helpful Prisma Commands:
```bash
# Push schema changes to database without migrations
npx prisma db push

# Regenerate Prisma Client TypeScript types
npx prisma generate

# Open Prisma Studio GUI
npx prisma studio
```

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Create student or instructor account | Public |
| `POST` | `/api/auth/login` | Sign in and receive JWT token | Public |

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
| `POST` | `/api/classroom/lessons/:lessonId/progress` | Mark lesson as completed | Enrolled Student |

### Quizzes (`/api/quizzes`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/quizzes/:quizId/submit` | Evaluate student answers & save attempt | Enrolled Student |

### Payments (`/api/checkout`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/checkout/create-checkout-session` | Generate Stripe Checkout URL | Authenticated |
| `POST` | `/api/checkout/webhook` | Listen for Stripe `checkout.session.completed` | Stripe Signature |

### Certificates & User (`/api/certificates` & `/api/users`)
| Method | Endpoint | Description | Auth |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/certificates/:courseId` | Generate dynamic completion PDF (Base64 URI) | Enrolled Student |
| `GET` | `/api/users` | Fetch current user profile | Authenticated |
| `PUT` | `/api/users` | Update bio, avatar, and full name | Authenticated |

---

## 🚢 Production Deployment & CI/CD

KLZ Academy includes a fully automated **GitHub Actions** deployment pipeline (`.github/workflows/deploy.yml`).

### How It Works:
1. Every commit pushed to the `main` branch triggers the GitHub Actions runner.
2. The runner connects to the production Ubuntu server via SSH using secrets configured in GitHub.
3. It performs a zero-downtime update:
   - Fetches and hard-resets to the latest commit.
   - Updates backend packages, generates Prisma Client, and pushes database schema updates.
   - Compiles TypeScript and builds the Next.js production bundle.
   - Re-daemonizes PM2 processes (`kdcourses-api` and `kdcourses-web`).
   - Reloads Nginx.

### Required GitHub Secrets:
Set these in your repository under **Settings → Secrets and variables → Actions**:
- `SERVER_IP`: Production server public IP.
- `SERVER_USERNAME`: Target user (e.g. `ubuntu`).
- `SSH_PRIVATE_KEY`: Raw OpenSSH private key with permissions to log into the server.

For manual server provisioning instructions, see [docs/Phase5_Ubuntu_Deployment.md](docs/Phase5_Ubuntu_Deployment.md).

---

## 🤝 Contributing & Code Standards

- **TypeScript Strictness:** Never use `any` unless required for third-party SDK compatibility.
- **Component Styling:** Use utility-first Tailwind CSS following the KLZ Academy palette (`brand-600`, `slate-950`).
- **No Placeholders:** Code must always be fully functional without `// ... rest of code` placeholders.
- **Automated Validation:** Always ensure `npm run build` succeeds in both `backend` and `frontend` before pushing to `main`.
