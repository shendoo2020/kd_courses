import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, priceType } = req.query;

    const whereClause: any = {};

    // Search filter across title and description
    if (search && typeof search === 'string' && search.trim() !== '') {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Category filter
    if (category && typeof category === 'string' && category !== 'All') {
      whereClause.category = category;
    }

    // Price filter (free vs paid)
    if (priceType === 'free') {
      whereClause.price = 0;
    } else if (priceType === 'paid') {
      whereClause.price = { gt: 0 };
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        instructor: {
          select: { name: true, email: true }
        },
        reviews: {
          select: { rating: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Compute average ratings for each course
    const coursesWithRating = courses.map(course => {
      const totalRatings = course.reviews.reduce((acc, r) => acc + r.rating, 0);
      const avgRating = course.reviews.length > 0 ? (totalRatings / course.reviews.length).toFixed(1) : null;
      return {
        ...course,
        avgRating,
        reviewCount: course.reviews.length
      };
    });
    
    res.json(coursesWithRating);
  } catch (error) {
    console.error('Get Catalog Error:', error);
    res.status(500).json({ message: 'Failed to fetch course catalog' });
  }
};

export const getCourseDetails = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: { name: true, email: true, role: true }
        },
        reviews: {
          include: {
            user: { select: { name: true, avatarUrl: true } }
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    res.json(course);
  } catch (error) {
    console.error('Get Course Details Error:', error);
    res.status(500).json({ message: 'Failed to fetch course details' });
  }
};

export const addReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: courseId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!rating || rating < 1 || rating > 5) {
      res.status(400).json({ message: 'Rating must be between 1 and 5' });
      return;
    }

    // Verify enrollment
    const enrollment = await prisma.enrollment.findUnique({
      where: { studentId_courseId: { studentId: userId, courseId } }
    });

    if (!enrollment) {
      res.status(403).json({ message: 'Only enrolled students can review this course' });
      return;
    }

    const review = await prisma.review.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: { rating: Number(rating), comment: comment || '' },
      create: { userId, courseId, rating: Number(rating), comment: comment || '' }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Add Review Error:', error);
    res.status(500).json({ message: 'Failed to submit review' });
  }
};

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, syllabus, price, category } = req.body;
    const instructorId = req.user?.id;

    if (!instructorId) {
      res.status(401).json({ message: 'Unauthorized: User ID missing from token' });
      return;
    }

    if (!title || !description || !syllabus) {
      res.status(400).json({ message: 'Title, description, and syllabus are required fields' });
      return;
    }

    const newCourse = await prisma.course.create({
      data: {
        title,
        description,
        syllabus,
        price: price ? parseFloat(price) : 0.0,
        category: category || 'Development',
        instructorId,
      }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};

export const handleSeedTourCourse = async (req: Request, res: Response): Promise<void> => {
  try {
    const { seedTourCourse } = await import('../utils/courseSeeder');
    const { seedPromptCourse } = await import('../utils/promptCourseSeeder');
    const tourCourse = await seedTourCourse();
    const promptCourse = await seedPromptCourse();
    res.status(200).json({
      message: 'Courses successfully initialized and verified',
      tourCourse,
      promptCourse,
    });
  } catch (error) {
    console.error('Seed Courses Error:', error);
    res.status(500).json({ message: 'Failed to seed courses', error });
  }
};

