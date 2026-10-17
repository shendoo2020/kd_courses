import { Router } from 'express';
import {
  validateCoupon,
  getCoupons,
  createCoupon,
  deactivateCoupon,
} from '../controllers/couponController';
import { protect, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.post('/validate', validateCoupon);
router.get('/', protect, authorizeRoles('ADMIN'), getCoupons);
router.post('/', protect, authorizeRoles('ADMIN'), createCoupon);
router.patch('/:id/deactivate', protect, authorizeRoles('ADMIN'), deactivateCoupon);

export default router;
