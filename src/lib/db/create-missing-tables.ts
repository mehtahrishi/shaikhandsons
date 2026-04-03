import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });

async function createMissingTables() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    // Create otp_tokens table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS otp_tokens (
        id SERIAL PRIMARY KEY NOT NULL,
        email VARCHAR(255) NOT NULL,
        token VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_otp_tokens_email ON otp_tokens(email);
      CREATE INDEX IF NOT EXISTS idx_otp_tokens_expires ON otp_tokens(expires_at);
    `);
    console.log('✅ Created otp_tokens table');

    // Create sessions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS sessions (
        id SERIAL PRIMARY KEY NOT NULL,
        user_id INTEGER NOT NULL,
        token_hash VARCHAR(255) NOT NULL UNIQUE,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
      CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at);
    `);
    console.log('✅ Created sessions table');

    // Create admin_users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT now()
      );
    `);
    console.log('✅ Created admin_users table');

    console.log('\n✅ All missing tables created successfully!');
  } catch (err) {
    console.error('❌ Error creating tables:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

createMissingTables();
