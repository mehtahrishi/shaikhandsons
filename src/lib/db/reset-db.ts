import { db } from './index';
import * as schema from './schema';

/**
 * ⚠️ WARNING: This script drops all tables and recreates them.
 * Only use in development!
 */
async function resetDatabase() {
  try {
    console.log('🔄 Resetting database...');

    // Drop all tables in order (respecting foreign keys)
    await db.execute(`DROP TABLE IF EXISTS "sessions" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "otp_tokens" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "vehicles" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "admin_users" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "brands" CASCADE`);
    await db.execute(`DROP TABLE IF EXISTS "users" CASCADE`);

    console.log('✅ Dropped all existing tables');

    // Recreate users table
    await db.execute(`
      CREATE TABLE "users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "full_name" varchar(255),
        "phone" varchar(20),
        "is_verified" boolean DEFAULT false,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    await db.execute(`CREATE INDEX "idx_users_email" ON "users" ("email")`);

    // Recreate OTP tokens table
    await db.execute(`
      CREATE TABLE "otp_tokens" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL,
        "token" varchar(255) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    await db.execute(`CREATE INDEX "idx_otp_tokens_email" ON "otp_tokens" ("email")`);
    await db.execute(`CREATE INDEX "idx_otp_tokens_expires" ON "otp_tokens" ("expires_at")`);

    // Recreate sessions table
    await db.execute(`
      CREATE TABLE "sessions" (
        "id" serial PRIMARY KEY NOT NULL,
        "user_id" integer NOT NULL,
        "token_hash" varchar(255) NOT NULL UNIQUE,
        "expires_at" timestamp NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    await db.execute(`CREATE INDEX "idx_sessions_user" ON "sessions" ("user_id")`);
    await db.execute(`CREATE INDEX "idx_sessions_expires" ON "sessions" ("expires_at")`);

    // Recreate brands table
    await db.execute(`
      CREATE TABLE "brands" (
        "id" serial PRIMARY KEY NOT NULL,
        "name" varchar(255) NOT NULL UNIQUE,
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      )
    `);

    // Recreate vehicles table
    await db.execute(`
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

    await db.execute(`CREATE INDEX "idx_vehicles_brand" ON "vehicles" ("brand_id")`);
    await db.execute(`CREATE INDEX "idx_vehicles_year" ON "vehicles" ("year")`);

    // Recreate admin users table
    await db.execute(`
      CREATE TABLE "admin_users" (
        "id" serial PRIMARY KEY NOT NULL,
        "email" varchar(255) NOT NULL UNIQUE,
        "password_hash" varchar(255) NOT NULL,
        "created_at" timestamp DEFAULT now()
      )
    `);

    console.log('✅ Recreated all tables with correct schema');

    // Seed admin user
    const { createAdminUser } = await import('./admin-auth');
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@gmail.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin';

    await createAdminUser(adminEmail, adminPassword);
    console.log('✅ Admin user seeded');

    console.log('✅ Database reset complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database reset failed:', error);
    process.exit(1);
  }
}

resetDatabase();
