import express, { Application } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import courseRoutes from './routes/courseRoutes';
import enrollRoutes from './routes/enrollRoutes';
import classroomRoutes from './routes/classroomRoutes';
import quizRoutes from './routes/quizRoutes';
import paymentRoutes from './routes/paymentRoutes';
import certRoutes from './routes/certRoutes';
import { errorHandler } from './middlewares/errorMiddleware';

const app: Application = express();

// Global Middlewares
app.use(cors());

// IMPORTANT: Mount Stripe payment routes BEFORE express.json() 
// so the webhook can receive the raw body for signature verification.
app.use('/api/checkout', paymentRoutes);

// Apply JSON parsing to all other routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/certificates', certRoutes);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'KDCourses API is running' });
});

// Fallback Global Error Handler
app.use(errorHandler);

export default app;
