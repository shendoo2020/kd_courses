import dotenv from 'dotenv';
// Load environment variables before importing app
dotenv.config();

import app from './app';
import prisma from './config/db';
import { seedTourCourse } from './utils/courseSeeder';
import { seedPromptCourse } from './utils/promptCourseSeeder';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt to connect to the database to ensure Prisma is working
    await prisma.$connect();
    console.log('Successfully connected to the PostgreSQL database.');

    // Auto-seed the platform courses if missing
    try {
      await seedTourCourse();
      console.log('[Server] Platform tour onboarding course verified.');
    } catch (seedError) {
      console.warn('[Server] Auto-seeding tour course encountered an error or skipped:', seedError);
    }

    try {
      await seedPromptCourse();
      console.log('[Server] Prompt Engineering course verified.');
    } catch (promptSeedError) {
      console.warn('[Server] Auto-seeding prompt course encountered an error or skipped:', promptSeedError);
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
