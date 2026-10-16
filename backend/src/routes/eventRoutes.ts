import { Router } from 'express';
import {
  getAllEvents,
  getEventDetails,
  registerForEvent,
  createEvent,
  getEventAttendees,
} from '../controllers/eventController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Public discovery and registration
router.get('/', getAllEvents);
router.get('/:id', getEventDetails);
router.post('/:id/register', registerForEvent);

// Admin / Instructor event scheduling
router.post('/', protect, authorizeRoles('ADMIN', 'INSTRUCTOR'), createEvent);
router.get('/:id/attendees', protect, authorizeRoles('ADMIN', 'INSTRUCTOR'), getEventAttendees);

export default router;
