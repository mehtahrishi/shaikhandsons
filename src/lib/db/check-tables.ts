import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });

async function checkTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    const res = await pool.query(
      `SELECT table_name FROM information_schema.tables WHERE table_schema='public'`
    );
    console.log('Tables in database:', res.rows.map((r) => r.table_name));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await pool.end();
  }
}

checkTables();
