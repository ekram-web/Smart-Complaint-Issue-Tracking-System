// Temporary script to seed Render database
const { execSync } = require('child_process');

// Set the Render database URL
process.env.DATABASE_URL = 'postgresql://astu_complaints_user:jFUxHHb9mNSitsU93BuDZipYWNMWLy1x@dpg-d6h84b4r85hc739a6clg-a/astu_complaints';

console.log('Seeding Render database...');

try {
  execSync('npx tsx src/utils/seed.ts', { 
    stdio: 'inherit',
    env: process.env 
  });
  console.log('✅ Seeding complete!');
} catch (error) {
  console.error('❌ Seeding failed:', error.message);
  process.exit(1);
}
