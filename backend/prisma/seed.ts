import { PrismaClient } from '@prisma/client';
import { seedTourCourse } from '../src/utils/courseSeeder';

const prisma = new PrismaClient();

async function main() {
  await seedTourCourse(prisma);
}

main()
  .catch((e) => {
    console.error('Database seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
