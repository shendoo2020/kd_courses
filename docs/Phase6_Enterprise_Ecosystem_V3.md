# Phase 6: Enterprise Ecosystem & Global Platform (V3 Expansion)

**Author:** [Elite Web Development Agency - Lead System Architect & DevOps Engineer]  
**Project:** KLZ Academy (KDCourses) - V3 Full-Stack Enterprise Expansion  
**Date:** October 2026  

---

## 1. Executive Summary

During this expansion cycle, **KLZ Academy** was elevated from a standard course-streaming platform into a commercial-grade, multi-tier academic and professional learning ecosystem on par with **Coursera**, **DeepLearning.AI**, and **edX**.

The platform now natively supports:
1. **Multi-Level Educational Pathways:** K-12 Youth STEM, Universities & Colleges, and Professional/Enterprise Engineering.
2. **On-Demand Custom Course Requests:** Direct B2B cohort requests with administrative proposal workflows.
3. **Print-on-Demand & Home Delivery Logistics:** Door-to-door physical delivery for bound lecture notes, summary booklets, study guides, and gold-foil certificates.
4. **Academic Seminars & Keynotes:** Public calendar and seat reservation system for live webinars and mentor talks.
5. **Faculty & Instructor Onboarding Portal:** Comprehensive recruitment funnel with automated role elevation.
6. **Institutional Credibility & Verified Outcomes:** Public faculty dossiers, student reviews, and tamper-proof cryptographic certificate validation.
7. **Native Arabic (العربية) & RTL System:** Complete Right-to-Left localization with the Cairo font stack, bilingual dictionary, and instant one-click language toggle.
8. **Threaded Classroom Q&A Forums:** Slide-level discussions with upvoting and instructor endorsement badges.
9. **In-App Real-Time Notification Center:** Notification bell alerting learners to replies, grades, and course milestones.
10. **In-Browser Code Execution Sandbox:** Integrated Monaco Editor with simulated execution and unit-test assertions.
11. **Capstone Project Grading Pipeline:** Repository/PDF submission portal with instructor grade rubrics.
12. **Promotional Coupon Discount Engine:** Dynamic validation for percentage/flat discounts during checkout.
13. **Enterprise B2B Multi-Seat Management:** Team dashboards (`/org/dashboard`), secure invite codes, and roster tracking.

---

## 2. Updated Architecture & Tech Stack

### Frontend Stack (`frontend/`)
* **Framework:** Next.js 14 (App Router) with React 18 & TypeScript
* **Styling & RTL:** Tailwind CSS 3.4 with custom `@layer base` RTL font rules
* **Typography:** Dual font stack: `Inter` (Latin) and Google Fonts `Cairo` (`wght@400..900` for Arabic)
* **Code Editor:** `@monaco-editor/react` (VS Code in the browser)
* **Markdown & Syntax:** `react-markdown` with `remark-gfm`
* **Media & Playback:** `react-player` for multi-source video streaming and Web Speech API for client-side voice narration
* **Icons:** `lucide-react`

### Backend Stack (`backend/`)
* **Runtime:** Node.js 20 LTS with Express.js REST API
* **Language:** TypeScript 5.3+
* **Database & ORM:** PostgreSQL 16 with Prisma ORM 5.22
* **Authentication:** Stateless JWT with bcryptjs password hashing and role-based access control (`STUDENT`, `INSTRUCTOR`, `ADMIN`, `ORG_ADMIN`)
* **Payments:** Stripe SDK (`stripe`) with raw webhook signature validation
* **Credential PDF Engine:** `pdf-lib` for tamper-proof vector certificate generation
* **Transactional Email:** `nodemailer` with configurable SMTP transport (compatible with Resend / SendGrid)

---

## 3. Database Schema Models Overview

The Prisma schema (`backend/prisma/schema.prisma`) was expanded to incorporate the following relational models:

```prisma
// Core Educational Models
Course            // Extended with targetAudience, deliveryMode, durationWeeks, scheduleDetails, inclusions, exclusions, prerequisites, gradingCriteria
User              // Extended with title, organization, academicCredentials, social links
Module / Lesson   // Curriculum hierarchy
Comment           // Extended with parentId (threads), upvotes, and isEndorsed (Phase 1)

// Pillar 1: Custom Requests
CourseRequest     // B2B & Cohort inquiries with triage statuses (PENDING_REVIEW, APPROVED, UNAVAILABLE, PROPOSAL_SENT)

// Pillar 2: Logistics & Printing
PrintOrder        // Physical material orders with status, courier tracking number, and address

// Pillar 3: Seminars & Events
Event             // Public seminars, webinars, and mentor talks with capacity limits
EventRegistration // RSVP attendance records

// Pillar 4: Faculty Recruitment
InstructorApplication // Instructor credentials, proposed syllabus, sample video URL, and review statuses

// Pillar 6: Social Proof
Testimonial       // Verified alumni reviews with ratings and certificate links

// Phase 1-4 Expansion
Notification      // In-app notifications with read status and deep links
ProjectSubmission // Capstone project repository links, status (PENDING_REVIEW, PASSED, REVISION_REQUIRED), and feedback
Coupon            // Discount codes with percent/amount deductions, max uses, and expiration dates
Organization      // B2B enterprise team entities with seat limits and unique join codes
OrgMembership     // Employee memberships with ORG_ADMIN or ORG_MEMBER roles
```

---

## 4. API Endpoints Reference

### Core & Educational Expansion
* `GET /api/courses` - Filter catalog by `category`, `targetAudience` (`K12`, `HIGHER_ED`, `PROFESSIONAL`), `deliveryMode`, `priceType`, and `search`.
* `GET /api/courses/:id` - Retrieve full course details, syllabus modules, instructor profile, and reviews.
* `POST /api/course-requests` - Submit custom B2B/cohort training request.
* `GET /api/course-requests` - Admin triage list for custom requests.
* `PATCH /api/course-requests/:id/status` - Admin update request status and assign instructor.

### Printing & Logistics
* `POST /api/delivery/orders` - Order physical study guide or bound notes.
* `GET /api/delivery/my-orders` - Student delivery order history.
* `GET /api/delivery/admin/orders` - Admin logistics fulfillment roster.
* `PATCH /api/delivery/admin/orders/:id` - Admin update shipping status and carrier tracking number.

### Seminars & Community
* `GET /api/events` - Public event calendar with remaining seat counts.
* `GET /api/events/:id` - Single event details.
* `POST /api/events/:id/register` - Complimentary seat RSVP reservation.
* `POST /api/events` - Admin/Instructor publish seminar.

### Faculty Recruitment
* `POST /api/instructor-applications/apply` - Submit teaching proposal and credentials.
* `GET /api/instructor-applications/admin` - Admin review board.
* `PATCH /api/instructor-applications/admin/:id` - Approve application (auto-promotes user to `INSTRUCTOR`).

### Classroom Q&A & Notifications
* `GET /api/classroom/lessons/:lessonId/comments` - Threaded discussion list for a lesson.
* `POST /api/classroom/lessons/:lessonId/comments` - Post question or nested reply.
* `PATCH /api/classroom/lessons/comments/:commentId/upvote` - Upvote helpful answer.
* `PATCH /api/classroom/lessons/comments/:commentId/endorse` - Instructor endorse answer.
* `GET /api/notifications` - User notifications list.
* `GET /api/notifications/unread-count` - Unread badge count.
* `PATCH /api/notifications/:id/read` - Mark single notification as read.
* `PATCH /api/notifications/mark-all-read` - Mark all notifications as read.

### Capstone Projects & Code Evaluation
* `POST /api/projects/submit` - Student submit project repo/document.
* `GET /api/projects/my-submissions` - Student submission history.
* `GET /api/projects/admin` - Instructor grading queue.
* `PATCH /api/projects/admin/:id/grade` - Instructor grade submission (`PASSED`, `REVISION_REQUIRED`) and provide feedback.

### Monetization & Enterprise
* `POST /api/coupons/validate` - Validate promotional coupon code.
* `GET /api/coupons` - Admin coupon management list.
* `POST /api/coupons` - Admin create coupon.
* `POST /api/orgs/join` - Employee join organization via invite code.
* `GET /api/orgs/me` - Get current user organization memberships.
* `GET /api/orgs/:id/dashboard` - Enterprise manager analytics and roster.

---

## 5. Frontend Pages & Component Architecture

```
frontend/src/
├── app/
│   ├── page.tsx                    # Multi-level catalog with audience/delivery filters & bilingual support
│   ├── layout.tsx                  # Global AppShell with NotificationBell, Language Switcher, Theme Toggle
│   ├── about/page.tsx              # Institutional governance, mission, and faculty review board
│   ├── custom-courses/page.tsx     # B2B cohort intake wizard with multi-step review
│   ├── events/page.tsx             # Academic seminars & keynotes calendar with live seat reservations
│   ├── teach/page.tsx              # Faculty recruitment & onboarding portal
│   ├── stories/page.tsx            # Alumni wall of love & live verified certificate gallery
│   ├── org/dashboard/page.tsx      # Enterprise manager portal: active seat usage & team progress
│   ├── courses/[id]/
│   │   ├── page.tsx                # Course details, package breakdown, coupon input, & print order modal
│   │   └── learn/
│   │       ├── page.tsx            # Classroom workspace with sidebar, player, & Q&A drawer
│   │       └── InteractiveLessonPlayer.tsx # Slide stepper with AI voice narration & Monaco sandbox
│   └── admin/dashboard/page.tsx    # Operations Control Center (Courses, Requests, Logistics, Faculty, Seminars)
├── components/
│   ├── CodeSandbox.tsx             # Monaco Editor (@monaco-editor/react) with run simulation & test assertions
│   ├── DiscussionDrawer.tsx        # Slide Q&A drawer with threaded replies, upvoting & instructor badges
│   ├── NotificationBell.tsx        # Header dropdown with unread badge and quick links
│   └── CapstoneSubmission.tsx      # Capstone repository submission and review history component
└── lib/
    ├── api.ts                      # Strongly typed Axios API client with service helpers
    ├── LanguageContext.tsx         # Global language context with localStorage persistence & RTL switching
    └── translations.ts             # Complete English & Arabic translation dictionaries
```

---

## 6. Verification & Automated CI/CD Deployment

All additions adhere strictly to zero-error build standards:
* **Backend:** `npm run build` (`tsc`) compiles cleanly with 0 type errors.
* **Frontend:** `npm run build` (`next build`) compiles all 18 static and dynamic routes cleanly with 0 type or lint errors.
* **CI/CD Pipeline:** Commits to `main` trigger `.github/workflows/deploy.yml`, which executes database migration, builds both projects, and reloads PM2 instances on the production Ubuntu server.
