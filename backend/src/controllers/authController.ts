import { Request, Response } from 'express';
import crypto from 'crypto';
import prisma from '../config/db';
import { hashPassword, comparePassword, generateToken } from '../utils/auth';
import { AuthRequest } from '../middlewares/authMiddleware';
import { sendTemporaryPasswordEmail } from '../utils/email';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, role } = req.body;

    // Validate inputs
    if (!name || !email || !password) {
      res.status(400).json({ message: 'Please provide all required fields' });
      return;
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      res.status(400).json({ message: 'User with this email already exists' });
      return;
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: role === 'INSTRUCTOR' ? 'INSTRUCTOR' : 'STUDENT',
      }
    });

    res.status(201).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      isTemporaryPassword: user.isTemporaryPassword,
      token: generateToken(user.id, user.role),
    });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Please provide email and password' });
      return;
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });

    // Verify user and password
    if (user && (await comparePassword(password, user.passwordHash))) {
      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isTemporaryPassword: user.isTemporaryPassword,
        token: generateToken(user.id, user.role),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Forgot Password: Send Temporary Password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ message: 'Please provide your email address' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });

    if (!user) {
      // Do not disclose whether email exists for security
      res.json({ message: 'If that email address is registered, a temporary password has been sent to it.' });
      return;
    }

    // Generate readable, secure temporary password (e.g. KLZ-8A2F9B)
    const randomCode = crypto.randomBytes(3).toString('hex').toUpperCase();
    const tempPassword = `KLZ-${randomCode}`;

    const passwordHash = await hashPassword(tempPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
        isTemporaryPassword: true,
      }
    });

    // Send email with temporary password
    await sendTemporaryPasswordEmail(user.email, tempPassword);

    res.json({ message: 'If that email address is registered, a temporary password has been sent to it.' });
  } catch (error) {
    console.error('Forgot Password Error:', error);
    res.status(500).json({ message: 'Server error processing password reset' });
  }
};

// Change Password: Authenticated user changing their password
export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    if (!currentPassword || !newPassword) {
      res.status(400).json({ message: 'Both current password and new password are required' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ message: 'New password must be at least 6 characters' });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check current password
    const isMatch = await comparePassword(currentPassword, user.passwordHash);
    if (!isMatch) {
      res.status(400).json({ message: 'Current password is incorrect' });
      return;
    }

    // Hash new password and remove temporary password flag
    const passwordHash = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        isTemporaryPassword: false,
      }
    });

    res.json({ message: 'Password successfully updated' });
  } catch (error) {
    console.error('Change Password Error:', error);
    res.status(500).json({ message: 'Server error updating password' });
  }
};
