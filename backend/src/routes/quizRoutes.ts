import { Router } from 'express';
import { submitQuiz } from '../controllers/quizController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

router.use(protect);
router.post('/:quizId/submit', submitQuiz);

export default router;