import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Capstone Projects - Student
export const submitProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ message: 'Unauthorized' }); return; }
    
    const { courseId, repoUrl, documentUrl, notes } = req.body;

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } }
    });
    if (!enrollment) { res.status(403).json({ message: 'Not enrolled in this course' }); return; }

    const submission = await prisma.projectSubmission.create({
      data: { courseId, userId, repoUrl, documentUrl, notes, status: 'PENDING_REVIEW' },
    });

    res.status(201).json({ message: 'Project submitted successfully for grading', submission });
  } catch (error) {
    console.error('Submit Project Error:', error);
    res.status(500).json({ message: 'Failed to submit project' });
  }
};

export const getMySubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ message: 'Unauthorized' }); return; }
    
    const { courseId } = req.query;
    const where: any = { userId };
    if (courseId) where.courseId = String(courseId);

    const submissions = await prisma.projectSubmission.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { course: { select: { title: true } } }
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get My Submissions Error:', error);
    res.status(500).json({ message: 'Failed to fetch submissions' });
  }
};

// Capstone Projects - Admin/Instructor
export const getAllSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, courseId } = req.query;
    const where: any = {};
    if (status && status !== 'ALL') where.status = String(status);
    if (courseId) where.courseId = String(courseId);

    // If instructor, only show submissions for their courses
    if (req.user?.role === 'INSTRUCTOR') {
      where.course = { instructorId: req.user.id };
    }

    const submissions = await prisma.projectSubmission.findMany({
      where,
      include: {
        user: { select: { name: true, email: true, avatarUrl: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(submissions);
  } catch (error) {
    console.error('Get All Submissions Error:', error);
    res.status(500).json({ message: 'Failed to fetch course submissions' });
  }
};

export const gradeSubmission = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, feedback } = req.body;

    const submission = await prisma.projectSubmission.update({
      where: { id },
      data: { status, feedback, gradedAt: new Date() },
      include: { user: { select: { id: true } }, course: { select: { title: true } } }
    });

    // Notify the student
    await prisma.notification.create({
      data: {
        userId: submission.user.id,
        title: `Project Graded: ${submission.course.title}`,
        message: `Your project submission has been reviewed. Status: ${status}.`,
        type: status === 'PASSED' ? 'SUCCESS' : 'WARNING',
        link: `/courses/${submission.courseId}/learn`,
      }
    });

    res.json({ message: 'Project graded successfully', submission });
  } catch (error) {
    console.error('Grade Submission Error:', error);
    res.status(500).json({ message: 'Failed to grade submission' });
  }
};
