import { Router, Response } from 'express';
import { protect, AuthRequest } from '../middlewares/authMiddleware';
import prisma from '../config/db';

const router = Router();

router.use(protect);

router.get('/', async (req: AuthRequest, res: Response) => {
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

router.put('/', async (req: AuthRequest, res: Response) => {
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

// Student Wishlist Endpoints
router.get('/wishlist', async (req: AuthRequest, res: Response) => {
  try {
    const wishlist = await prisma.wishlist.findMany({
      where: { userId: req.user?.id },
      include: {
        course: {
          include: {
            instructor: { select: { name: true } },
            reviews: { select: { rating: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch wishlist' });
  }
});

router.post('/wishlist/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const item = await prisma.wishlist.upsert({
      where: { userId_courseId: { userId, courseId } },
      update: {},
      create: { userId, courseId }
    });

    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: 'Failed to add to wishlist' });
  }
});

router.delete('/wishlist/:courseId', async (req: AuthRequest, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    await prisma.wishlist.deleteMany({
      where: { userId, courseId }
    });

    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: 'Failed to remove from wishlist' });
  }
});

export default router;