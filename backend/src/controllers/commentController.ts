import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getLessonComments = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    
    const comments = await prisma.comment.findMany({
      where: { lessonId, parentId: null }, // Only fetch top-level comments
      include: {
        user: { select: { id: true, name: true, avatarUrl: true, role: true } },
        replies: {
          include: {
            user: { select: { id: true, name: true, avatarUrl: true, role: true } },
          },
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(comments);
  } catch (error) {
    console.error('Get Comments Error:', error);
    res.status(500).json({ message: 'Failed to fetch discussion' });
  }
};

export const postComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { lessonId } = req.params;
    const { text, parentId } = req.body;
    const userId = req.user?.id;

    if (!userId || !text) {
      res.status(400).json({ message: 'User ID and text are required' });
      return;
    }

    const comment = await prisma.comment.create({
      data: {
        text,
        lessonId,
        userId,
        parentId: parentId || null
      },
      include: { user: { select: { id: true, name: true, avatarUrl: true, role: true } } }
    });

    // Handle notifications
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } }
    });

    if (lesson) {
      // If it's a reply to another comment, notify the original commenter
      if (parentId) {
        const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
        if (parentComment && parentComment.userId !== userId) {
          await prisma.notification.create({
            data: {
              userId: parentComment.userId,
              title: `New Reply from ${comment.user.name}`,
              message: `Someone replied to your question in lesson "${lesson.title}".`,
              type: 'MESSAGE',
              link: `/courses/${lesson.module.courseId}/learn`,
            }
          });
        }
      } 
      // If it's a top-level question from a student, notify the instructor
      else if (req.user?.role === 'STUDENT') {
        await prisma.notification.create({
          data: {
            userId: lesson.module.course.instructorId,
            title: `New Q&A in "${lesson.title}"`,
            message: `${comment.user.name} asked a question in your course.`,
            type: 'INFO',
            link: `/courses/${lesson.module.courseId}/learn`,
          }
        });
      }
    }

    res.status(201).json(comment);
  } catch (error) {
    console.error('Post Comment Error:', error);
    res.status(500).json({ message: 'Failed to post comment' });
  }
};

export const upvoteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { upvotes: { increment: 1 } }
    });
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to upvote comment' });
  }
};

export const endorseComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { commentId } = req.params;
    if (req.user?.role !== 'INSTRUCTOR' && req.user?.role !== 'ADMIN') {
      res.status(403).json({ message: 'Only instructors can endorse answers' });
      return;
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: { isEndorsed: true }
    });

    // Notify the user who got endorsed
    await prisma.notification.create({
      data: {
        userId: updated.userId,
        title: `Instructor Endorsed Your Answer!`,
        message: `Your answer was marked as helpful by the course instructor.`,
        type: 'SUCCESS',
      }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to endorse comment' });
  }
};
