import { Router } from 'express';
import { protect } from '../middlewares/authMiddleware';
import prisma from '../config/db';

const router = Router();

router.use(protect);

router.get('/', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user?.id },
      select: { name: true, email: true, role: true, bio: true, avatarUrl: true }
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch profile' });
  }
});

router.put('/', async (req, res) => {
  try {
    const { name, bio, avatarUrl } = req.body;
    const updatedUser = await prisma.user.update({
      where: { id: req.user?.id },
      data: { name, bio, avatarUrl },
      select: { name: true, email: true, role: true, bio: true, avatarUrl: true }
    });
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update profile' });
  }
});

export default router;