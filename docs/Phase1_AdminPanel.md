# Phase 1: Architecture & Tech Stack Definition (Admin Panel Expansion)

**Author:** [Lead System Architect]
**Project:** KDCourses - Premium Course Management Platform

## 1. Feature Architecture: Admin / Instructor Panel

To allow course creation directly from the UI, we must expand our existing decoupled architecture. We will introduce a secure Admin/Instructor portal. 

### Backend Architectural Additions
*   **Role-Based Access Control (RBAC):** We will leverage the existing `Role` enum in our Prisma schema (`STUDENT`, `INSTRUCTOR`, `ADMIN`). The new API endpoints must be strictly guarded by the `authorizeRoles('INSTRUCTOR', 'ADMIN')` middleware.
*   **New API Endpoints:** 
    *   `POST /api/courses`: Accepts course details (title, description, syllabus, price) and creates a new course record linked to the authenticated user's ID.
*   **Validation:** Incoming payloads will be strictly typed and validated before hitting the database.

### Frontend Architectural Additions
*   **Routing (Next.js App Router):**
    *   `/admin/dashboard`: A centralized hub for instructors to view courses they have created.
    *   `/admin/courses/new`: A dedicated form page for course creation.
*   **Tech Stack Additions:**
    *   **React Hook Form:** For managing complex form state (title, long-form syllabus, price parsing).
    *   **Zod (Optional/Integrated):** For client-side schema validation to prevent malformed requests from reaching the server.
    *   **Tailwind / Shadcn UI:** We will construct a premium form layout using standard Shadcn-like form primitives (styled purely with Tailwind to match our brand).

## 2. Updated Directory Structure (Diff)

We will integrate these new files into our existing Monorepo structure.

```text
KDCourses/
├── backend/
│   └── src/
│       ├── controllers/
│       │   └── courseController.ts     <-- ADD: createCourse logic
│       └── routes/
│           └── courseRoutes.ts         <-- ADD: POST / with RBAC middleware
│
└── frontend/
    └── src/
        ├── app/
        │   └── admin/                  <-- NEW: Admin layout and pages
        │       ├── layout.tsx          <-- Admin specific navigation
        │       ├── dashboard/page.tsx  <-- Instructor course list
        │       └── courses/new/page.tsx<-- Course creation form
        └── components/
            └── admin/                  <-- NEW: Admin UI components
                └── CourseForm.tsx
```