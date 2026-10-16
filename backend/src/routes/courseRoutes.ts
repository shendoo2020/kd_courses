import { Router } from 'express';
import { getCatalog, getCourseDetails, createCourse, addReview, handleSeedTourCourse } from '../controllers/courseController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Platform Onboarding Tour Seeder endpoint
router.post('/seed-tour', handleSeedTourCourse);
router.get('/seed-tour', handleSeedTourCourse);

// Public Routes
// GET /api/courses (supports ?search= & ?category= & ?priceType=)
router.get('/', getCatalog);

// GET /api/courses/:id
router.get('/:id', getCourseDetails);

// Protected Student Review Route
// POST /api/courses/:id/reviews
router.post('/:id/reviews', protect, addReview);

// Protected Admin/Instructor Routes
// POST /api/courses
router.post('/', protect, authorizeRoles('INSTRUCTOR', 'ADMIN'), createCourse);

export default router;
