const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');
const path = require('path');

// choose env file
const env = process.env.PLAYWRIGHT_ENV || process.env.ENV || 'dev';
const envPath = path.resolve(process.cwd(), `.env.${env}`);
dotenv.config({ path: envPath });

const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL?.trim();
console.log(`Using environment: ${env} (loaded from ${envPath})`);
if (!dbUrl) {
  console.error('ERROR: DATABASE_URL is not set. Check your .env files.');
  process.exit(1);
}

// Mask password for logging
const masked = dbUrl.replace(/(:\/\/[^:]+:)([^@]+)@/, '$1***@');
console.log('DATABASE_URL=', masked);

const prisma = new PrismaClient();

(async () => {
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Connected! Time:', now);
    process.exitCode = 0;
  } catch (e) {
    console.error('❌ Connection error:', e.message || e);
    process.exitCode = 2;
  } finally {
    await prisma.$disconnect();
  }
})();
