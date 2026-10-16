import { Router } from 'express';
import {
  submitCourseRequest,
  getAllCourseRequests,
  updateCourseRequestStatus,
} from '../controllers/courseRequestController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Public inquiry submission
router.post('/', submitCourseRequest);

// Admin-only management
router.get('/', protect, authorizeRoles('ADMIN', 'INSTRUCTOR'), getAllCourseRequests);
router.patch('/:id/status', protect, authorizeRoles('ADMIN'), updateCourseRequestStatus);

export default router;
