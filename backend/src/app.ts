import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollRoutes from './routes/enrollRoutes';
import classroomRoutes from './routes/classroomRoutes';
import quizRoutes from './routes/quizRoutes';
import paymentRoutes from './routes/paymentRoutes';
import certRoutes from './routes/certRoutes';
import userRoutes from './routes/userRoutes';
import instructorRoutes from './routes/instructorRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// Global Middlewares
app.use(cors());

// IMPORTANT: Mount Stripe payment routes BEFORE express.json() 
// so the webhook can receive the raw body for signature verification.
app.use('/api/checkout', paymentRoutes);

// Apply JSON parsing to all other routes (10MB limit for base64 avatars and course media)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certRoutes);
app.use('/api/users', userRoutes);
app.use('/api/instructor/analytics', instructorRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'KDCourses API is running' });
});

// Fallback Global Error Handler
app.use(errorHandler);

export default app;
