import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Pillar 4: Submit Instructor Recruitment Application
export const submitInstructorApplication = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      fullName,
      email,
      phone,
      currentAffiliation,
      highestDegree,
      linkedinUrl,
      portfolioUrl,
      resumeUrl,
      courseProposalTitle,
      courseProposalSummary,
      sampleVideoUrl,
      targetAudience,
    } = req.body;

    if (!fullName || !email || !phone || !currentAffiliation || !highestDegree || !courseProposalTitle || !courseProposalSummary) {
      res.status(400).json({
        message: 'fullName, email, phone, currentAffiliation, highestDegree, courseProposalTitle, and courseProposalSummary are required.',
      });
      return;
    }

    const application = await prisma.instructorApplication.create({
      data: {
        fullName,
        email,
        phone,
        currentAffiliation,
        highestDegree,
        linkedinUrl: linkedinUrl || null,
        portfolioUrl: portfolioUrl || null,
        resumeUrl: resumeUrl || null,
        courseProposalTitle,
        courseProposalSummary,
        sampleVideoUrl: sampleVideoUrl || null,
        targetAudience: targetAudience || 'PROFESSIONAL',
        status: 'NEW_APPLICATION',
      },
    });

    console.log(`[INSTRUCTOR APPLICATION] Application received from ${fullName} (${email}), Proposed course: "${courseProposalTitle}"`);

    res.status(201).json({
      message: 'Thank you for applying to teach at KLZ Academy. Our Academic Review Board will review your credentials and syllabus within 3-5 business days.',
      application,
    });
  } catch (error) {
    console.error('Submit Instructor Application Error:', error);
    res.status(500).json({ message: 'Failed to submit instructor application' });
  }
};

// Admin: Get all instructor applications
export const getAllApplications = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;

    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const applications = await prisma.instructorApplication.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    res.json(applications);
  } catch (error) {
    console.error('Get All Applications Error:', error);
    res.status(500).json({ message: 'Failed to fetch instructor applications' });
  }
};

// Admin: Update status & review notes (Optional auto-elevation of user to INSTRUCTOR)
export const updateApplicationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const existing = await prisma.instructorApplication.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Application not found' });
      return;
    }

    const updated = await prisma.instructorApplication.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(reviewNotes !== undefined && { reviewNotes }),
      },
    });

    // If approved, check if user exists in User table and promote to INSTRUCTOR
    if (status === 'APPROVED') {
      const user = await prisma.user.findUnique({ where: { email: existing.email } });
      if (user && user.role !== 'ADMIN') {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: 'INSTRUCTOR',
            title: user.title || existing.highestDegree,
            organization: user.organization || existing.currentAffiliation,
            linkedinUrl: user.linkedinUrl || existing.linkedinUrl,
          },
        });
        console.log(`[INSTRUCTOR APPLICATION] Elevated existing user ${user.email} to INSTRUCTOR role.`);
      }
    }

    res.json({
      message: `Instructor application status updated to ${updated.status}`,
      application: updated,
    });
  } catch (error) {
    console.error('Update Application Status Error:', error);
    res.status(500).json({ message: 'Failed to update application status' });
  }
};
