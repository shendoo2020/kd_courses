import { Router } from 'express';
import { register, login, forgotPassword, changePassword } from '../controllers/authController';
import { protect } from '../middlewares/authMiddleware';

const router = Router();

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /api/auth/change-password (Protected)
router.post('/change-password', protect, changePassword);

export default router;
