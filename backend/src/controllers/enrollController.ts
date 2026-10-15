import { Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

export const enrollStudent = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!courseId) {
      res.status(400).json({ message: 'courseId is required' });
      return;
    }

    // Check if course exists
    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // Check for existing enrollment
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId,
          courseId,
        }
      }
    });

    if (existingEnrollment) {
      res.status(400).json({ message: 'You are already enrolled in this course' });
      return;
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId,
        courseId,
        status: 'ACTIVE',
      },
      include: {
        course: true // Return course details with the enrollment confirmation
      }
    });

    res.status(201).json(enrollment);
  } catch (error) {
    console.error('Enrollment Error:', error);
    res.status(500).json({ message: 'Server error during enrollment' });
  }
};

export const getStudentDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { studentId },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    res.json(enrollments);
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch student dashboard' });
  }
};
