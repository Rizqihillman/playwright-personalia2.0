import { connectDB } from './utils/db';

(async () => {
  try {
    const client = await connectDB();
    const result = await client.query('SELECT NOW()');
    console.log('🕒 Server time:', result.rows[0].now);

    await client.end();
    console.log('🔌 Connection closed.');
  } catch (error) {
    if (error instanceof Error) {
      console.error('❌ Database connection error:', error.message);
    } else {
      console.error('❌ Unknown error:', error);
    }
  }
})();
