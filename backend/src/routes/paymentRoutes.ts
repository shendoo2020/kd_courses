import { Router } from 'express';
import { createCheckoutSession, stripeWebhook } from '../controllers/paymentController';
import { protect } from '../middlewares/authMiddleware';
import express from 'express';

const router = Router();

// Webhook MUST use express.raw for signature validation
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Protected routes
router.use(protect);
router.post('/create-checkout-session', createCheckoutSession);

export default router;