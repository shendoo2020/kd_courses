import { Router } from 'express';
import {
  getLessonComments,
  postComment,
  upvoteComment,
  endorseComment,
} from '../controllers/commentController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// /api/classroom/lessons/:lessonId/comments
router.get('/:lessonId/comments', getLessonComments);
router.post('/:lessonId/comments', protect, postComment);
router.patch('/comments/:commentId/upvote', protect, upvoteComment);
router.patch('/comments/:commentId/endorse', protect, endorseComment);

export default router;
