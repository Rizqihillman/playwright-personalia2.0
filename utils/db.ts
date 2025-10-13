import { Client } from 'pg';
import dotenv from 'dotenv';

// Load environment file (.env.dev)
dotenv.config({ path: '.env.dev' });

export async function connectDB() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    console.log('✅ Database connected successfully!');
    return client;
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Failed to connect to database:', error.message);
    } else {
      console.error('❌ Unknown error:', error);
    }
    throw error;
  }
}
