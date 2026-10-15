import { Request, Response } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  // Omit apiVersion to let the installed SDK version use its default typing
});

// Create Stripe Checkout Session
export const createCheckoutSession = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { courseId } = req.body;
    const studentId = req.user?.id;

    if (!studentId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    
    if (!course) {
      res.status(404).json({ message: 'Course not found' });
      return;
    }

    // If free, handle directly (no Stripe needed)
    if (course.price === 0) {
      res.status(400).json({ message: 'Course is free, use /api/enrollments directly.' });
      return;
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'] as any, // Cast to any to bypass strict version mismatches
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
            },
            unit_amount: Math.round(course.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/courses/${courseId}?canceled=true`,
      metadata: {
        studentId,
        courseId,
      },
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Stripe Session Error:', error);
    res.status(500).json({ message: 'Failed to create payment session' });
  }
};

// Handle Stripe Webhooks
export const stripeWebhook = async (req: Request, res: Response): Promise<void> => {
  const sig = req.headers['stripe-signature'] as string;

  let event;
  try {
    // Requires raw body (configured in app.ts)
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET || 'whsec_mock'
    );
  } catch (err: any) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the checkout.session.completed event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const { studentId, courseId } = session.metadata as { studentId: string; courseId: string };

    try {
      // Grant enrollment automatically
      await prisma.enrollment.upsert({
        where: { studentId_courseId: { studentId, courseId } },
        update: {},
        create: { studentId, courseId, status: 'ACTIVE' },
      });
    } catch (dbError) {
      console.error('Failed to grant enrollment post-payment:', dbError);
    }
  }

  res.status(200).json({ received: true });
};
