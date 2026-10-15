import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

export const getCatalog = async (req: Request, res: Response): Promise<void> => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(courses);
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

export const createCourse = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, syllabus, price } = req.body;
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
        instructorId,
      }
    });

    res.status(201).json(newCourse);
  } catch (error) {
    console.error('Create Course Error:', error);
    res.status(500).json({ message: 'Failed to create course' });
  }
};
