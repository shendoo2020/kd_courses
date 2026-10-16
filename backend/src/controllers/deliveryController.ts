import { Response } from 'express';
import prisma from '../config/db';
import { AuthRequest } from '../middlewares/authMiddleware';

// Pillar 2: Create Material Printing & Delivery Order
export const createPrintOrder = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    const {
      courseId,
      itemType,
      quantity,
      recipientName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
    } = req.body;

    if (!recipientName || !phone || !addressLine1 || !city || !state || !postalCode) {
      res.status(400).json({
        message: 'Recipient name, phone, addressLine1, city, state, and postalCode are required.',
      });
      return;
    }

    // Determine default pricing based on material type
    let unitPrice = 19.99;
    if (itemType === 'FULL_LECTURE_NOTES') unitPrice = 29.99;
    if (itemType === 'VERIFIED_PHYSICAL_CERTIFICATE') unitPrice = 34.99;
    if (itemType === 'STUDY_GUIDE') unitPrice = 14.99;

    const qty = quantity ? parseInt(quantity, 10) : 1;
    const totalAmount = parseFloat((unitPrice * qty).toFixed(2));

    const order = await prisma.printOrder.create({
      data: {
        userId,
        courseId: courseId || null,
        itemType: itemType || 'SUMMARY_BOOKLET',
        quantity: qty,
        recipientName,
        phone,
        addressLine1,
        addressLine2: addressLine2 || null,
        city,
        state,
        postalCode,
        country: country || 'USA',
        totalAmount,
        paymentStatus: 'PAID', // Simulated immediate authorization or Stripe checkout
        status: 'ORDER_RECEIVED',
      },
      include: {
        course: { select: { title: true } },
      },
    });

    res.status(201).json({
      message: 'Print & delivery order placed successfully. Your materials are queued for binding and shipping.',
      order,
    });
  } catch (error) {
    console.error('Create Print Order Error:', error);
    res.status(500).json({ message: 'Failed to create print order' });
  }
};

// Student: View own delivery orders
export const getMyPrintOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const orders = await prisma.printOrder.findMany({
      where: { userId },
      include: {
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get My Print Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch print orders' });
  }
};

// Admin: View all orders across platform
export const getAllPrintOrders = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status } = req.query;
    const where: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      where.status = status;
    }

    const orders = await prisma.printOrder.findMany({
      where,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    console.error('Get All Print Orders Error:', error);
    res.status(500).json({ message: 'Failed to fetch fulfillment orders' });
  }
};

// Admin: Update order status, courier, and tracking code
export const updatePrintOrderStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status, carrier, trackingNumber } = req.body;

    const existing = await prisma.printOrder.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ message: 'Print order not found' });
      return;
    }

    const updateData: any = {};
    if (status) updateData.status = status;
    if (carrier !== undefined) updateData.carrier = carrier;
    if (trackingNumber !== undefined) updateData.trackingNumber = trackingNumber;

    const updated = await prisma.printOrder.update({
      where: { id },
      data: updateData,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { title: true } },
      },
    });

    res.json({
      message: `Print order status successfully updated to ${updated.status}`,
      order: updated,
    });
  } catch (error) {
    console.error('Update Print Order Status Error:', error);
    res.status(500).json({ message: 'Failed to update delivery order' });
  }
};
