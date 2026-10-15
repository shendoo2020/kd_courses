import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// In a real application, ensure JWT_SECRET is strictly loaded from the .env file.
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_dev_secret_kdcourses_only';

export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateToken = (userId: string, role: string): string => {
  return jwt.sign({ id: userId, role }, JWT_SECRET, {
    expiresIn: '30d', // Tokens expire in 30 days
  });
};
