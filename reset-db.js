const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function resetDatabase() {
  const client = await pool.connect();
  try {
    console.log('🔄 Resetting database...');

    // Drop all tables in order (respecting foreign keys)
    await client.query(`DROP TABLE IF EXISTS "sessions" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "otp_tokens" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "vehicles" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "admin_users" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "brands" CASCADE`);
    await client.query(`DROP TABLE IF EXISTS "users" CASCADE`);

    console.log('✅ Dropped all existing tables');

    // Recreate users table
    await client.query(`
      CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "full_name" varchar(255),
        "phone" varchar(20),
        "address" varchar(500),
        "is_verified" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await client.query(`CREATE INDEX "idx_users_email" ON "users" ("email")`);

    // Recreate OTP tokens table
    await client.query(`
      CREATE TABLE "otp_tokens" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "token" varchar(255) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    await client.query(`CREATE INDEX "idx_otp_tokens_email" ON "otp_tokens" ("email")`);
    await client.query(`CREATE INDEX "idx_otp_tokens_expires" ON "otp_tokens" ("expires_at")`);

    // Recreate sessions table
    await client.query(`
      CREATE TABLE "sessions" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "token_hash" varchar(255) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    await client.query(`CREATE INDEX "idx_sessions_user" ON "sessions" ("user_id")`);
    await client.query(`CREATE INDEX "idx_sessions_expires" ON "sessions" ("expires_at")`);

    // Recreate brands table
    await client.query(`
      CREATE TABLE "brands" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Recreate vehicles table
    await client.query(`
      CREATE TABLE "vehicles" (
        "id" serial PRIMARY KEY NOT NULL,
        "brand_id" integer NOT NULL,
        "make" varchar(255) NOT NULL,
        "model" varchar(255) NOT NULL,
        "year" integer NOT NULL,
        "trim" varchar(255),
        "price" numeric(12, 2),
        "battery_range_km" integer,
        "horsepower" integer,
        "zero_to_sixty_seconds" numeric(5, 2),
        "design_philosophy" text,
        "image_urls" text[] DEFAULT '{}',
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now(),
        CONSTRAINT "vehicles_brand_id_fk" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE CASCADE
      )
    `);

    await client.query(`CREATE INDEX "idx_vehicles_brand" ON "vehicles" ("brand_id")`);
    await client.query(`CREATE INDEX "idx_vehicles_year" ON "vehicles" ("year")`);

    // Recreate admin users table
    await client.query(`
      CREATE TABLE "admin_users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    console.log('✅ Recreated all tables with correct schema');

    // No need to seed here - app will do it on startup
    console.log('✅ Database reset complete!');
  } catch (error) {
    console.error('❌ Database reset failed:', error.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

resetDatabase();
