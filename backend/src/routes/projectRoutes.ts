import { Router } from 'express';
import {
  submitProject,
  getMySubmissions,
  getAllSubmissions,
  gradeSubmission,
} from '../controllers/projectController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Student
router.post('/submit', protect, submitProject);
router.get('/my-submissions', protect, getMySubmissions);

// Instructor / Admin
router.get('/admin', protect, authorizeRoles('ADMIN', 'INSTRUCTOR'), getAllSubmissions);
router.patch('/admin/:id/grade', protect, authorizeRoles('ADMIN', 'INSTRUCTOR'), gradeSubmission);

export default router;
