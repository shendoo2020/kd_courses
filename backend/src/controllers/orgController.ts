import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';
import crypto from 'crypto';

// Admin creates an organization and assigns initial seats
export const createOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, contactEmail, seatLimit } = req.body;
    if (!name || !contactEmail) {
      res.status(400).json({ message: 'Organization name and contact email are required' });
      return;
    }

    const joinCode = `KLZ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const org = await prisma.organization.create({
      data: { name, contactEmail, seatLimit: seatLimit ? parseInt(seatLimit) : 10, joinCode },
    });

    res.status(201).json(org);
  } catch (error) {
    console.error('Create Org Error:', error);
    res.status(500).json({ message: 'Failed to create organization' });
  }
};

// User uses join code to enter org and claim a seat
export const joinOrganization = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const { joinCode } = req.body;
    if (!joinCode) { res.status(400).json({ message: 'Join code is required' }); return; }

    const org = await prisma.organization.findUnique({ where: { joinCode } });
    if (!org) { res.status(404).json({ message: 'Invalid join code' }); return; }

    if (org.activeSeats >= org.seatLimit) {
      res.status(400).json({ message: 'Organization seat limit reached. Contact your administrator.' });
      return;
    }

    const existing = await prisma.orgMembership.findUnique({
      where: { orgId_userId: { orgId: org.id, userId } },
    });
    if (existing) {
      res.status(400).json({ message: 'You are already a member of this organization' });
      return;
    }

    await prisma.$transaction([
      prisma.orgMembership.create({ data: { orgId: org.id, userId, role: 'ORG_MEMBER' } }),
      prisma.organization.update({ where: { id: org.id }, data: { activeSeats: { increment: 1 } } }),
    ]);

    res.json({ message: `Successfully joined ${org.name}` });
  } catch (error) {
    console.error('Join Org Error:', error);
    res.status(500).json({ message: 'Failed to join organization' });
  }
};

// Get My Organizations
export const getMyOrganizations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) { res.status(401).json({ message: 'Unauthorized' }); return; }

    const memberships = await prisma.orgMembership.findMany({
      where: { userId },
      include: { org: true },
    });
    res.json(memberships);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch organizations' });
  }
};

// Admin/Org Admin: Get Organization Dashboard
export const getOrgDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id: orgId } = req.params;
    const userId = req.user?.id;

    // Check permissions
    if (req.user?.role !== 'ADMIN') {
      const membership = await prisma.orgMembership.findUnique({
        where: { orgId_userId: { orgId, userId: userId! } }
      });
      if (!membership || membership.role !== 'ORG_ADMIN') {
        res.status(403).json({ message: 'Forbidden: Org Admin access required' });
        return;
      }
    }

    const org = await prisma.organization.findUnique({
      where: { id: orgId },
      include: {
        members: {
          include: {
            user: { select: { id: true, name: true, email: true, enrollments: { select: { status: true } } } }
          }
        }
      }
    });

    if (!org) { res.status(404).json({ message: 'Organization not found' }); return; }

    res.json(org);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch organization dashboard' });
  }
};
