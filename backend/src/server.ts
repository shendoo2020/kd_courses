import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import prisma from './config/db';
import { seedTourCourse } from './utils/courseSeeder';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt to connect to the database to ensure Prisma is working
    await prisma.$connect();
    console.log('Successfully connected to the PostgreSQL database.');

    // Auto-seed the platform tour onboarding course if missing
    try {
      await seedTourCourse();
    } catch (seedError) {
      console.warn('[Server] Auto-seeding tour course encountered an error or skipped:', seedError);
    }

    app.listen(PORT, () => {
      console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
