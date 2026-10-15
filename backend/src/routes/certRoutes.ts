import { Router } from 'express';
import { generateCertificate } from '../controllers/certController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);

// GET /api/certificates/:courseId
router.get('/:courseId', generateCertificate);

export default router;