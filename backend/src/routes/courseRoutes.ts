import { Router } from 'express';
import { getCatalog, getCourseDetails, createCourse } from '../controllers/courseController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Public Routes
// GET /api/courses
router.get('/', getCatalog);

// GET /api/courses/:id
router.get('/:id', getCourseDetails);

// Protected Admin/Instructor Routes
// POST /api/courses
router.post('/', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), createCourse);

export default router;
