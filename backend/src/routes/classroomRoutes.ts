import { Router } from 'express';
import { createModule, createLesson, getClassroom, markLessonComplete, addLessonComment } from '../controllers/classroomController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// All classroom routes require authentication
router.use(protect);

// Student Routes
router.get('/:courseId', getClassroom);
router.post('/lessons/:lessonId/progress', markLessonComplete);
router.post('/lessons/:lessonId/comments', addLessonComment);

// Instructor Routes
router.post('/:courseId/modules', authorizeRoles('INSTRUCTOR', 'ADMIN'), createModule);
router.post('/modules/:moduleId/lessons', authorizeRoles('INSTRUCTOR', 'ADMIN'), createLesson);

export default router;