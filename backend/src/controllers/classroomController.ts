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

// Instructor: Update a lesson or quiz
export const updateLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { title, content } = req.body;
    const instructorId = req.user?.id;
    const userRole = req.user?.role;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    if (userRole !== 'ADMIN' && lesson.module.course.instructorId !== instructorId) {
      res.status(403).json({ message: 'Not authorized to edit this lesson' });
      return;
    }

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title && { title }),
        ...(content !== undefined && { content }),
      }
    });

    res.json(updated);
  } catch (error) {
    console.error('Update Lesson Error:', error);
    res.status(500).json({ message: 'Failed to update lesson' });
  }
};

// Instructor: Delete a lesson or quiz
export const deleteLesson = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const instructorId = req.user?.id;
    const userRole = req.user?.role;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    if (userRole !== 'ADMIN' && lesson.module.course.instructorId !== instructorId) {
      res.status(403).json({ message: 'Not authorized to delete this lesson' });
      return;
    }

    // Delete progress and comments linked to lesson
    await prisma.lessonProgress.deleteMany({ where: { lessonId } });
    await prisma.comment.deleteMany({ where: { lessonId } });

    await prisma.lesson.delete({ where: { id: lessonId } });

    res.json({ message: 'Lesson successfully deleted' });
  } catch (error) {
    console.error('Delete Lesson Error:', error);
    res.status(500).json({ message: 'Failed to delete lesson' });
  }
};

// Instructor: Delete a module
export const deleteModule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { moduleId } = req.params;
    const instructorId = req.user?.id;
    const userRole = req.user?.role;

    const module = await prisma.module.findUnique({
      where: { id: moduleId },
      include: { course: true, lessons: true }
    });

    if (!module) {
      res.status(404).json({ message: 'Module not found' });
      return;
    }

    if (userRole !== 'ADMIN' && module.course.instructorId !== instructorId) {
      res.status(403).json({ message: 'Not authorized to delete this module' });
      return;
    }

    // Delete all lessons and progress in this module
    for (const les of module.lessons) {
      await prisma.lessonProgress.deleteMany({ where: { lessonId: les.id } });
      await prisma.comment.deleteMany({ where: { lessonId: les.id } });
    }
    await prisma.lesson.deleteMany({ where: { moduleId } });
    await prisma.quiz.deleteMany({ where: { moduleId } });
    await prisma.module.delete({ where: { id: moduleId } });

    res.json({ message: 'Module and all its content successfully deleted' });
  } catch (error) {
    console.error('Delete Module Error:', error);
    res.status(500).json({ message: 'Failed to delete module' });
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

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true }
    });

    if (!lesson) {
      res.status(404).json({ message: 'Lesson not found' });
      return;
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId: studentId, lessonId }
      },
      update: { completed: true },
      create: { userId: studentId, lessonId, completed: true }
    });

    // Check if all lessons in the course are now completed (Bug 2)
    const courseId = lesson.module.courseId;
    const totalLessons = await prisma.lesson.count({
      where: { module: { courseId } }
    });

    const completedLessons = await prisma.lessonProgress.count({
      where: {
        userId: studentId,
        completed: true,
        lesson: { module: { courseId } }
      }
    });

    const isCourseCompleted = totalLessons > 0 && completedLessons >= totalLessons;

    if (isCourseCompleted) {
      await prisma.enrollment.updateMany({
        where: { studentId, courseId },
        data: { status: 'COMPLETED' }
      });
    }

    res.json({
      progress,
      isCourseCompleted,
      completedLessons,
      totalLessons
    });
  } catch (error) {
    console.error('Mark Lesson Complete Error:', error);
    res.status(500).json({ message: 'Failed to update progress' });
  }
};
