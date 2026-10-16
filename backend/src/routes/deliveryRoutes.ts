import { Router } from 'express';
import {
  createPrintOrder,
  getMyPrintOrders,
  getAllPrintOrders,
  updatePrintOrderStatus,
} from '../controllers/deliveryController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// Student order placement and history
router.post('/orders', protect, createPrintOrder);
router.get('/my-orders', protect, getMyPrintOrders);

// Admin logistics and status management
router.get('/admin/orders', protect, authorizeRoles('ADMIN'), getAllPrintOrders);
router.patch('/admin/orders/:id', protect, authorizeRoles('ADMIN'), updatePrintOrderStatus);

export default router;
