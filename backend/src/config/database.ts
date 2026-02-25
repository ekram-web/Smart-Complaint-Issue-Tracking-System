// Database connection using Prisma 7 with PostgreSQL adapter
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

// Create PostgreSQL connection pool with explicit config (workaround for numeric password issue)
const pool = new pg.Pool({
  host: 'localhost',
  port: 5432,
  database: 'astu_complaints',
  user: 'postgres',
  password: String(process.env.DB_PASSWORD || '1203'), // Ensure password is string
});

// Create Prisma adapter
const adapter = new PrismaPg(pool);

// Create Prisma client with adapter
const prisma = new PrismaClient({
  adapter,
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
});

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
  await pool.end();
});

export default prisma;
