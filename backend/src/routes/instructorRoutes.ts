import { Router, Response } from 'express';
import { protect, authorizeRoles, AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

const router = Router();

router.use(protect);
router.use(authorizeRoles('INSTRUCTOR', 'ADMIN'));

// GET /api/instructor/analytics
router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const instructorId = req.user?.id;

    if (!instructorId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Fetch all courses taught by instructor
    const courses = await prisma.course.findMany({
      where: { instructorId },
      include: {
        enrollments: true,
        reviews: true,
        modules: {
          include: { lessons: true }
        }
      }
    });

    const totalCourses = courses.length;
    let totalStudents = 0;
    let totalRevenue = 0;
    let allRatings: number[] = [];

    const courseStats = courses.map(course => {
      const studentCount = course.enrollments.length;
      const revenue = studentCount * course.price;
      totalStudents += studentCount;
      totalRevenue += revenue;

      const courseRatings = course.reviews.map(r => r.rating);
      allRatings.push(...courseRatings);

      const avgRating = courseRatings.length > 0 
        ? (courseRatings.reduce((a, b) => a + b, 0) / courseRatings.length).toFixed(1) 
        : 'N/A';

      return {
        id: course.id,
        title: course.title,
        price: course.price,
        studentCount,
        revenue,
        avgRating,
        modulesCount: course.modules.length
      };
    });

    const overallAvgRating = allRatings.length > 0 
      ? (allRatings.reduce((a, b) => a + b, 0) / allRatings.length).toFixed(1) 
      : '5.0';

    res.json({
      summary: {
        totalCourses,
        totalStudents,
        totalRevenue: totalRevenue.toFixed(2),
        overallAvgRating
      },
      courses: courseStats
    });
  } catch (err) {
    console.error('Analytics Error:', err);
    res.status(500).json({ message: 'Failed to fetch instructor analytics' });
  }
});

export default router;