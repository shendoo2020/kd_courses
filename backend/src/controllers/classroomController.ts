import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

// Instructor: Add a module to a course
export const createModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { title, order } = req.body;
    const instructorId = req.user?.id;

    // Verify course ownership
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || course.instructorId !== instructorId) {
      res.status(403).json({ message: 'Not authorized to modify this course' });
      return;
    }

    const newModule = await prisma.module.create({
      data: { title, order: order || 0, courseId },
    });

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create module' });
  }
};

// Instructor: Add a lesson to a module
export const createLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const { title, content, order } = req.body;
    const instructorId = req.user?.id;

    // Verify ownership via the module -> course relationship
    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true }
    });

    if (!module || module.course.instructorId !== instructorId) {
      res.status(403).json({ message: 'Not authorized' });
      return;
    }

    const newLesson = await prisma.lesson.create({
      data: { title, content, order: order || 0, moduleId },
    });

    res.status(201).json(newLesson);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create lesson' });
  }
};

// Student: Get all classroom content for an enrolled course
export const getClassroom = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId, courseId } }
    });

    if (!enrollment && req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'You must be enrolled to access the classroom' });
      return;
    }

    // Fetch deep nested structure
    const classroom = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          orderBy: { order: 'asc' },
          include: {
            lessons: {
              orderBy: { order: 'asc' },
              include: {
                progress: {
                  where: { userId: studentId } // Only fetch this specific student's progress
                },
                comments: {
                  include: {
                    user: { select: { name: true, role: true, avatarUrl: true } }
                  },
                  orderBy: { createdAt: 'desc' }
                }
              }
            },
            quizzes: true
          }
        }
      }
    });

    res.json(classroom);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch classroom data' });
  }
};

// Student & Instructor: Add a comment/question to a lesson
export const addLessonComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!text || text.trim() === '') {
      res.status(400).json({ message: 'Comment text cannot be empty' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        lessonId,
        userId
      },
      include: {
        user: { select: { name: true, role: true, avatarUrl: true } }
      }
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to post comment' });
  }
};

// Student: Mark lesson as complete
export const markLessonComplete = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId: studentId, lessonId }
      },
      update: { completed: true },
      create: { userId: studentId, lessonId, completed: true }
    });

    res.json(progress);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
};
