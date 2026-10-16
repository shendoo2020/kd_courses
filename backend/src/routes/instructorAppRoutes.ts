import { Router } from 'express';
import {
  submitInstructorApplication,
  getAllApplications,
  updateApplicationStatus,
} from '../controllers/instructorAppController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Public recruitment form
router.post('/apply', submitInstructorApplication);

// Admin-only application tracking & reviews
router.get('/admin', protect, authorizeRoles('ADMIN'), getAllApplications);
router.patch('/admin/:id', protect, authorizeRoles('ADMIN'), updateApplicationStatus);

export default router;
