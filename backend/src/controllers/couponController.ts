import { Request, Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Verify a coupon (Public/Student during checkout)
export const validateCoupon = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    if (!code) { res.status(400).json({ message: 'Coupon code is required' }); return; }

    const coupon = await prisma.coupon.findUnique({ where: { code: String(code).toUpperCase() } });
    
    if (!coupon || !coupon.isActive) {
      res.status(404).json({ message: 'Invalid or expired coupon' });
      return;
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      res.status(400).json({ message: 'This coupon has expired' });
      return;
    }

    if (coupon.maxUses && coupon.uses >= coupon.maxUses) {
      res.status(400).json({ message: 'This coupon has reached its maximum usage limit' });
      return;
    }

    res.json(coupon);
  } catch (error) {
    console.error('Validate Coupon Error:', error);
    res.status(500).json({ message: 'Failed to validate coupon' });
  }
};

// Admin: Get all coupons
export const getCoupons = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch coupons' });
  }
};

// Admin: Create coupon
export const createCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { code, discountPercent, discountAmount, maxUses, expiresAt } = req.body;

    if (!code) { res.status(400).json({ message: 'Coupon code is required' }); return; }

    const newCoupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountPercent: discountPercent ? parseInt(discountPercent) : null,
        discountAmount: discountAmount ? parseFloat(discountAmount) : null,
        maxUses: maxUses ? parseInt(maxUses) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    res.status(201).json(newCoupon);
  } catch (error) {
    console.error('Create Coupon Error:', error);
    res.status(500).json({ message: 'Failed to create coupon' });
  }
};

// Admin: Deactivate coupon
export const deactivateCoupon = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive: false },
    });
    res.json(coupon);
  } catch (error) {
    res.status(500).json({ message: 'Failed to deactivate coupon' });
  }
};
