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
            instructor: { select: { name: true } },
            modules: {
              include: {
                lessons: { select: { id: true } }
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute progress and update completion status if necessary
    const enrichedEnrollments = await Promise.all(
      enrollments.map(async (enr) => {
        const totalLessons = enr.course.modules.reduce(
          (acc, mod) => acc + mod.lessons.length,
          0
        );

        const completedLessons = await prisma.lessonProgress.count({
          where: {
            userId: studentId,
            completed: true,
            lesson: { module: { courseId: enr.courseId } }
          }
        });

        const progressPercentage = totalLessons > 0
          ? Math.min(100, Math.round((completedLessons / totalLessons) * 100))
          : 0;

        const isCompleted = totalLessons > 0 && completedLessons >= totalLessons;

        // Auto-update enrollment status in database
        if (isCompleted && enr.status !== 'COMPLETED') {
          await prisma.enrollment.update({
            where: { id: enr.id },
            data: { status: 'COMPLETED' }
          });
        } else if (!isCompleted && enr.status === 'COMPLETED') {
          await prisma.enrollment.update({
            where: { id: enr.id },
            data: { status: 'ACTIVE' }
          });
        }

        return {
          id: enr.id,
          studentId: enr.studentId,
          courseId: enr.courseId,
          status: isCompleted ? 'COMPLETED' : enr.status,
          createdAt: enr.createdAt,
          progressPercentage,
          completedLessons,
          totalLessons,
          course: {
            id: enr.course.id,
            title: enr.course.title,
            description: enr.course.description,
            price: enr.course.price,
            category: enr.course.category,
            instructor: enr.course.instructor
          }
        };
      })
    );

    res.json(enrichedEnrollments);
  } catch (error) {
    console.error('Dashboard Fetch Error:', error);
    res.status(500).json({ message: 'Failed to fetch student dashboard' });
  }
};
