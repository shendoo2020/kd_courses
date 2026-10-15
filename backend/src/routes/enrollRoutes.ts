import { Router } from 'express';
import { enrollStudent, getStudentDashboard } from '../controllers/enrollController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// All enrollment routes require authentication
router.use(protect);

// POST /api/enrollments
// Only students should be able to enroll
router.post('/', authorizeRoles('STUDENT'), enrollStudent);

// GET /api/enrollments/dashboard
// Fetch enrolled courses for the student dashboard
router.get('/dashboard', authorizeRoles('STUDENT'), getStudentDashboard);

export default router;
