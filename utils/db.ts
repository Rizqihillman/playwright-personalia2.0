// utils/db.ts
import dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: '.env.dev' });

let client: Client | null = null;

export async function connectDB() {
  if (client) return client; // gunakan koneksi lama kalau sudah ada

  client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  await client.connect();
  console.log('✅ DB connected');
  return client;
}

export async function disconnectDB() {
  if (client) {
    await client.end();
    console.log('🔌 DB disconnected');
    client = null;
  }
}

export async function resetDBConnection() {
  await disconnectDB();
  await connectDB();
}
