# Phase 4: Validation & Security Protocols

**Author:** [DevOps & Validation Engineer]
**Project:** KDCourses - Premium Course Management Platform

## Security Architecture Overview

To ensure KDCourses meets enterprise and academic standards, the following security and validation mechanisms have been strictly implemented across the backend and frontend systems. 

---

### 1. Password Hashing & Authentication
We do not store plain-text passwords. All user credentials are cryptographically secured.
*   **Library:** `bcryptjs`
*   **Implementation:** (`backend/src/utils/auth.ts`)
*   **Mechanism:** When a user registers, a unique salt is generated with a cost factor of `10` (`bcrypt.genSalt(10)`). The password is then hashed against this salt. During login, the `bcrypt.compare()` function securely evaluates the incoming plain-text password against the stored hash to prevent timing attacks.

### 2. JWT (JSON Web Token) Expiration & Session Management
The platform utilizes stateless authentication to ensure high scalability.
*   **Library:** `jsonwebtoken`
*   **Implementation:** (`backend/src/utils/auth.ts` and `backend/src/middlewares/authMiddleware.ts`)
*   **Mechanism:** Upon successful authentication, a JWT is issued containing the user's `id` and `role`. 
*   **Security Control (Expiration):** The token is strictly configured with an expiration window of 30 days (`expiresIn: '30d'`). Once expired, the user must re-authenticate, mitigating the risk of hijacked, long-lived sessions.
*   **Security Control (Protection):** The `protect` middleware extracts the token from the `Authorization: Bearer <token>` header, verifies the signature against the server's `JWT_SECRET`, and denies access (`401 Unauthorized`) if tampered with or expired.

### 3. SQL Injection (SQLi) Prevention
Given the relational nature of our PostgreSQL database, mitigating SQL injection is a top priority.
*   **Library:** `Prisma ORM`
*   **Implementation:** Across all controllers (`backend/src/controllers/*.ts`).
*   **Mechanism:** We do not write raw SQL queries. By routing all database interactions through Prisma Client, the ORM automatically utilizes parameterized queries and prepared statements. Any user input (such as `req.body.email` or `req.params.id`) is treated strictly as data, never as executable code, entirely neutralizing SQL injection attack vectors.

### 4. Cross-Origin Resource Sharing (CORS)
To protect our API from unauthorized domains and CSRF-adjacent attacks, CORS is explicitly controlled.
*   **Library:** `cors` (Express Middleware)
*   **Implementation:** (`backend/src/app.ts`)
*   **Mechanism:** The API implements the `cors()` middleware. In a production environment, this is configured to strictly allow traffic *only* from our recognized Next.js frontend domain (e.g., `https://kdcourses.com`), rejecting XHR/Fetch requests initiated from unauthorized origins.

### 5. Environment & Error Leakage Protection
*   **Mechanism:** Our custom `errorMiddleware` (`backend/src/middlewares/errorMiddleware.ts`) intercepts all unhandled exceptions. If the application is running in `production` mode, the stack trace is deliberately stripped (`stack: process.env.NODE_ENV === 'production' ? null : err.stack`) to prevent internal file structures, database structures, or logic from leaking to the client.

### 6. Role-Based Access Control (RBAC)
*   **Implementation:** (`backend/src/middlewares/authMiddleware.ts`)
*   **Mechanism:** The `authorizeRoles` middleware ensures that API boundaries are respected. For instance, the `POST /api/enrollments` endpoint strictly enforces `authorizeRoles('STUDENT')`, ensuring that instructors or unauthenticated guests cannot manipulate enrollment state.

---
*Validation complete. The system architecture is secure and ready for production deployment.*