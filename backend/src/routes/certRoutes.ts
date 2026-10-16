import { Router } from 'express';
import { generateCertificate, verifyCertificate } from '../controllers/certController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// Public verification route
router.get('/verify/:certId', verifyCertificate);

// Protected student routes
router.use(protect);

// GET /api/certificates/:courseId
router.get('/:courseId', generateCertificate);

export default router;