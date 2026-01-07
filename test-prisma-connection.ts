import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Client as PgClient } from 'pg';

// Load env file according to PLAYWRIGHT_ENV / ENV (fallback to dev)
const env = process.env.PLAYWRIGHT_ENV || process.env.ENV || 'dev';
dotenv.config({ path: path.resolve(process.cwd(), `.env.${env}`) });

async function testWithPg() {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL is not set. Check your .env files (e.g. .env.dev).');
    process.exit(1);
  }

  const pg = new PgClient({ connectionString: process.env.DATABASE_URL });
  try {
    await pg.connect();
    const res = await pg.query('SELECT NOW()');
    console.log('✅ PG connected! Time:', res.rows[0]);
    await pg.end();
    return true;
  } catch (err: any) {
    console.error('❌ PG connection error:', err.message ?? err);
    try { await pg.end(); } catch {};
    return false;
  }
}

async function testWithPrisma() {
  const prisma = new PrismaClient();
  try {
    const now = await prisma.$queryRaw`SELECT NOW()`;
    console.log('✅ Prisma connected! Time:', now);
    await prisma.$disconnect();
    return true;
  } catch (err: any) {
    console.error('❌ Prisma connection error:', err?.message ?? err);
    if (err?.code === 'P5010' || /fetch failed/i.test(String(err))) {
      console.error('\nLikely cause: Prisma client could not fetch its query engine (network or permissions issue).');
      console.error('Suggestions:');
      console.error('- Ensure this machine has internet access so Prisma can download its query engine during `npx prisma generate`.');
      console.error('- Run `npx prisma generate` and observe any errors.');
      console.error('- If offline, consider generating the client with engines bundled for your platform or configure PRISMA_CLIENT_ENGINE_TYPE to use a local binary.');
    }
    try { await prisma.$disconnect(); } catch {}
    return false;
  }
}

(async () => {
  console.log(`Using environment: ${env} (loaded .env.${env})`);
  const masked = (process.env.DATABASE_URL || '').replace(/(:\/\/[^:]+:)([^@]+)@/, '$1***@');
  console.log('DATABASE_URL:', masked || '(not set)');

  const pgOk = await testWithPg();
  if (!pgOk) {
    console.error('\nPG test failed — stop here. Check network, host, port, and credentials.');
    process.exit(2);
  }

  // PG succeeded, try Prisma to determine if issue is Prisma-specific
  const prismaOk = await testWithPrisma();
  if (!prismaOk) {
    console.error('\nPrisma test failed even though raw PG connection worked. Follow the suggestions above (npx prisma generate, ensure internet for engine download, or configure client engine).');
    process.exit(3);
  }

  console.log('\nAll checks passed.');
})();
