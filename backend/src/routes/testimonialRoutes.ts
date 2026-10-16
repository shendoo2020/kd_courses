import { Router } from 'express';
import {
  getFeaturedTestimonials,
  createTestimonial,
} from '../controllers/testimonialController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Public showcase
router.get('/', getFeaturedTestimonials);

// Submit testimonial
router.post('/', protect, createTestimonial);

export default router;
