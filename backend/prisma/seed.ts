import { PrismaClient } from '@prisma/client';
import { seedTourCourse } from '../src/utils/courseSeeder';
import { seedPromptCourse } from '../src/utils/promptCourseSeeder';

const prisma = new PrismaClient();

async function main() {
  await seedTourCourse(prisma);
  await seedPromptCourse(prisma);
}

main()
  .catch((e) => {
    console.error('Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
