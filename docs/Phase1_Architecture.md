# Phase 1: Architecture & Tech Stack Definition

**Author:** [Lead System Architect]
**Project:** KDCourses - Premium Course Management Platform

## 1. System Architecture & Tech Stack Selection

To achieve the scalability, SEO performance, and premium aesthetics of platforms like Coursera and DeepLearning.AI, we will utilize a decoupled Client-Server architecture. The stack relies heavily on TypeScript across both ends to ensure type safety, fewer runtime errors, and high developer productivity.

### Frontend (Client-Side)
*   **Framework:** **Next.js 14** (App Router) with **React 18**. Selected for its robust Server-Side Rendering (SSR) capabilities, which are crucial for SEO (indexing course catalogs) and initial page load speed.
*   **Language:** **TypeScript**.
*   **Styling:** **Tailwind CSS**. Allows for rapid, utility-first styling to achieve a minimalist, academic look.
*   **UI Components:** **Shadcn UI** (Radix UI primitives). Provides accessible, unstyled components that we will heavily customize with our premium color palette (deep blues, clean whites, subtle grays).
*   **State Management & Data Fetching:** **React Query** (TanStack Query) for caching and synchronizing asynchronous server state.
*   **Form Validation:** **React Hook Form** coupled with **Zod** for schema validation.

### Backend (Server-Side)
*   **Runtime & Framework:** **Node.js** (v20 LTS) with **Express.js**. Lightweight, highly scalable, and excellent for RESTful API development.
*   **Language:** **TypeScript**.
*   **Database:** **PostgreSQL**. A robust, ACID-compliant relational database perfectly suited for managing complex relationships (Users -> Enrollments -> Courses).
*   **ORM (Object-Relational Mapper):** **Prisma**. Provides type-safe database access, automated migrations, and an intuitive schema definition language.
*   **Authentication:** **JWT (JSON Web Tokens)** for stateless, secure session management. **Bcrypt.js** for secure password hashing.
*   **API Design:** RESTful principles with strict JSON responses and standard HTTP status codes.

### DevOps & Deployment Target (Phase 5 Preview)
*   **OS:** Ubuntu 22.04 LTS or 24.04 LTS Server.
*   **Reverse Proxy:** Nginx.
*   **Process Manager:** PM2 (for Node.js) to ensure zero-downtime reloads.
*   **Containerization:** Docker (Optional but recommended for the database).

---

## 2. Project Directory Structure

The project will be organized into a Monorepo-style structure with clear separation of concerns between the frontend and backend environments.

```text
KDCourses/
├── backend/                        # Node.js Express API
│   ├── prisma/                     # Database schema and migrations
│   │   └── schema.prisma           # Prisma models (Users, Courses, Enrollments)
│   ├── src/
│   │   ├── config/                 # Environment variables and configuration files
│   │   │   └── db.ts               # Database connection logic
│   │   ├── controllers/            # Route handlers (Business logic)
│   │   │   ├── authController.ts   # Login/Register logic
│   │   │   ├── courseController.ts # Catalog and course details
│   │   │   └── enrollController.ts # Student enrollment logic
│   │   ├── middlewares/            # Express middlewares
│   │   │   ├── authMiddleware.ts   # JWT verification
│   │   │   └── errorMiddleware.ts  # Global error handling
│   │   ├── routes/                 # API route definitions
│   │   │   ├── authRoutes.ts
│   │   │   ├── courseRoutes.ts
│   │   │   └── enrollRoutes.ts
│   │   ├── utils/                  # Helper functions (Token generation, hashing)
│   │   ├── app.ts                  # Express app initialization & middleware registration
│   │   └── server.ts               # Server entry point (app.listen)
│   ├── .env                        # Backend environment variables
│   ├── package.json                # Backend dependencies
│   └── tsconfig.json               # TypeScript configuration
│
└── frontend/                       # Next.js Application
    ├── public/                     # Static assets (images, icons)
    ├── src/
    │   ├── app/                    # Next.js 14 App Router
    │   │   ├── (auth)/             # Authentication routes
    │   │   │   ├── login/page.tsx
    │   │   │   └── register/page.tsx
    │   │   ├── courses/            # Course catalog and details
    │   │   │   ├── page.tsx        # Landing/Catalog Page
    │   │   │   └── [id]/page.tsx   # Course Detail Page
    │   │   ├── dashboard/          # Student Dashboard
    │   │   │   └── page.tsx
    │   │   ├── layout.tsx          # Root layout (Navbar, Footer, Providers)
    │   │   ├── page.tsx            # Home page redirect/landing
    │   │   └── globals.css         # Tailwind directives and global styles
    │   ├── components/             # Reusable UI components
    │   │   ├── ui/                 # Shadcn UI base components (buttons, cards, inputs)
    │   │   ├── layout/             # Header, Footer, Sidebar
    │   │   └── courses/            # CourseCard, SyllabusList
    │   ├── lib/                    # Utility functions and API clients
    │   │   ├── api.ts              # Axios/Fetch instance configured with Auth headers
    │   │   └── utils.ts            # Tailwind class merge utilities
    │   └── types/                  # TypeScript interfaces (Course, User)
    ├── .env.local                  # Frontend environment variables
    ├── components.json             # Shadcn UI configuration
    ├── next.config.mjs             # Next.js configuration
    ├── package.json                # Frontend dependencies
    ├── tailwind.config.ts          # Tailwind theme and colors
    └── tsconfig.json               # TypeScript configuration
```