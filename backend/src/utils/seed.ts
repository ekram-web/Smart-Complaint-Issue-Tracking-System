// Seed initial data for testing
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { hashPassword } from './password';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create PostgreSQL connection pool
const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
});

export const seedDatabase = async () => {
  try {
    // Seeding database...

    // Create admin user
    const adminPassword = await hashPassword('admin123');
    const admin = await prisma.user.upsert({
      where: { email: 'admin@astu.edu.et' },
      update: {},
      create: {
        name: 'Admin User',
        email: 'admin@astu.edu.et',
        password: adminPassword,
        role: 'ADMIN',
      },
    });

    // Create staff user
    const staffPassword = await hashPassword('staff123');
    const staff = await prisma.user.upsert({
      where: { email: 'staff@astu.edu.et' },
      update: {},
      create: {
        name: 'Staff Member',
        email: 'staff@astu.edu.et',
        password: staffPassword,
        role: 'STAFF',
        department: 'IT Department',
      },
    });

    // Create student user
    const studentPassword = await hashPassword('student123');
    const student = await prisma.user.upsert({
      where: { email: 'student@astu.edu.et' },
      update: {},
      create: {
        name: 'John Doe',
        email: 'student@astu.edu.et',
        password: studentPassword,
        role: 'STUDENT',
        identification: 'ASTU/2024/001',
      },
    });

    // Create categories
    const categories = [
      { name: 'Dormitory', description: 'Dormitory maintenance and issues', department: 'Housing Department' },
      { name: 'Laboratory', description: 'Lab equipment and facility issues', department: 'Lab Management' },
      { name: 'Internet', description: 'Network and connectivity issues', department: 'IT Department' },
      { name: 'Classroom', description: 'Classroom facility issues', department: 'Facilities Management' },
      { name: 'Library', description: 'Library services and resources', department: 'Library Services' },
    ];

    for (const cat of categories) {
      await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
    }

    // Database seeded successfully
    
    await prisma.$disconnect();
    await pool.end();
  } catch (error) {
    // Seeding failed
    await prisma.$disconnect();
    await pool.end();
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
