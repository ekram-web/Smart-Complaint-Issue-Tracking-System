// Seed initial data for testing
import { PrismaClient, Priority, TicketStatus } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { hashPassword } from './password';
import { generateTicketId } from './ticketId';
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

    const createdCategories = [];
    for (const cat of categories) {
      const category = await prisma.category.upsert({
        where: { name: cat.name },
        update: {},
        create: cat,
      });
      createdCategories.push(category);
    }

    // Create sample tickets
    const sampleTickets = [
      {
        title: 'Broken AC in Room 204',
        description: 'The air conditioning unit in dormitory room 204 is not working. It has been making strange noises for the past week.',
        categoryId: createdCategories[0].id,
        authorId: student.id,
        priority: Priority.HIGH,
        status: TicketStatus.OPEN,
      },
      {
        title: 'Microscope not functioning',
        description: 'The microscope in Lab B is not turning on. Need urgent repair for upcoming practical exam.',
        categoryId: createdCategories[1].id,
        authorId: student.id,
        priority: Priority.HIGH,
        status: TicketStatus.IN_PROGRESS,
      },
      {
        title: 'Slow WiFi in Library',
        description: 'Internet connection in the library is extremely slow. Cannot download research papers.',
        categoryId: createdCategories[2].id,
        authorId: student.id,
        priority: Priority.MEDIUM,
        status: TicketStatus.OPEN,
      },
      {
        title: 'Projector not working in Room 301',
        description: 'The projector in classroom 301 is not displaying properly. Screen is flickering.',
        categoryId: createdCategories[3].id,
        authorId: student.id,
        priority: Priority.HIGH,
        status: TicketStatus.RESOLVED,
      },
      {
        title: 'Missing books in library',
        description: 'Several reference books for Computer Science are missing from the library shelves.',
        categoryId: createdCategories[4].id,
        authorId: student.id,
        priority: Priority.LOW,
        status: TicketStatus.OPEN,
      },
      {
        title: 'Water leakage in dormitory bathroom',
        description: 'There is water leaking from the ceiling in the bathroom of Block C, Room 105.',
        categoryId: createdCategories[0].id,
        authorId: student.id,
        priority: Priority.HIGH,
        status: TicketStatus.IN_PROGRESS,
      },
      {
        title: 'Lab equipment shortage',
        description: 'Not enough lab coats and safety goggles for all students in Chemistry Lab.',
        categoryId: createdCategories[1].id,
        authorId: student.id,
        priority: Priority.MEDIUM,
        status: TicketStatus.OPEN,
      },
      {
        title: 'Network port not working',
        description: 'Ethernet port in Computer Lab 2 is not providing internet connection.',
        categoryId: createdCategories[2].id,
        authorId: student.id,
        priority: Priority.MEDIUM,
        status: TicketStatus.RESOLVED,
      },
      {
        title: 'Broken chairs in lecture hall',
        description: 'Multiple chairs in Lecture Hall A are broken and need replacement.',
        categoryId: createdCategories[3].id,
        authorId: student.id,
        priority: Priority.LOW,
        status: TicketStatus.OPEN,
      },
      {
        title: 'Library AC too cold',
        description: 'The air conditioning in the library reading room is set too cold. Many students are uncomfortable.',
        categoryId: createdCategories[4].id,
        authorId: student.id,
        priority: Priority.LOW,
        status: TicketStatus.RESOLVED,
      },
    ];

    for (const ticket of sampleTickets) {
      const ticketId = await generateTicketId();
      await prisma.ticket.create({
        data: {
          ...ticket,
          ticketId,
        },
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log('📊 Created:');
    console.log('   - 3 users (admin, staff, student)');
    console.log('   - 5 categories');
    console.log('   - 10 sample tickets');
    console.log('\n🔑 Login credentials:');
    console.log('   Admin: admin@astu.edu.et / admin123');
    console.log('   Staff: staff@astu.edu.et / staff123');
    console.log('   Student: student@astu.edu.et / student123');
    
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
