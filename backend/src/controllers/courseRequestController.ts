import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Pillar 1: Submit Custom Course Request (Public/Student/B2B Institutional)
export const submitCourseRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      requesterName,
      email,
      phone,
      organization,
      targetAudience,
      topic,
      studentCount,
      neededTimeframe,
      deliveryMode,
      specificRequirements,
    } = req.body;

    if (!requesterName || !email || !topic || !neededTimeframe) {
      res.status(400).json({
        message: 'requesterName, email, topic, and neededTimeframe are required fields.',
      });
      return;
    }

    const request = await prisma.courseRequest.create({
      data: {
        requesterName,
        email,
        phone: phone || null,
        organization: organization || null,
        targetAudience: targetAudience || 'PROFESSIONAL',
        topic,
        studentCount: studentCount ? parseInt(studentCount, 10) : 10,
        neededTimeframe,
        deliveryMode: deliveryMode || 'HYBRID',
        specificRequirements: specificRequirements || null,
        status: 'PENDING_REVIEW',
      },
    });

    console.log(`[CUSTOM COURSE REQUEST] New inquiry logged from ${requesterName} (${organization || 'Individual'}) for topic: ${topic}`);

    res.status(201).json({
      message: 'Your custom course request has been submitted successfully. An academic advisor will review and contact you within 24-48 hours.',
      request,
    });
  } catch (error) {
    console.error('Submit Course Request Error:', error);
    res.status(500).json({ message: 'Failed to submit course request' });
  }
};

// Admin: Get all custom course requests
export const getAllCourseRequests = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, targetAudience } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }
    if (targetAudience && typeof targetAudience === 'string' && targetAudience !== 'ALL') {
      where.targetAudience = targetAudience;
    }

    const requests = await prisma.courseRequest.findMany({
      where,
      include: {
        assignedInstructor: {
          select: { id: true, name: true, email: true, organization: true, title: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(requests);
  } catch (error) {
    console.error('Get All Course Requests Error:', error);
    res.status(500).json({ message: 'Failed to fetch course requests' });
  }
};

// Admin: Update status, assign instructor, and add notes
export const updateCourseRequestStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, adminNotes, assignedInstructorId } = req.body;

    const existing = await prisma.courseRequest.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Course request not found' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
    if (assignedInstructorId !== undefined) {
      updateData.assignedInstructorId = assignedInstructorId || null;
    }

    const updated = await prisma.courseRequest.update({
      where: { id },
      data: updateData,
      include: {
        assignedInstructor: {
          select: { id: true, name: true, email: true, title: true },
        },
      },
    });

    res.json({
      message: `Course request status successfully updated to ${updated.status}`,
      request: updated,
    });
  } catch (error) {
    console.error('Update Course Request Status Error:', error);
    res.status(500).json({ message: 'Failed to update course request' });
  }
};
