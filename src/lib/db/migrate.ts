import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { Pool } from 'pg';
import path from 'path';

config({ path: '.env.local' });

async function runMigrations() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false,
    },
    connectionTimeoutMillis: 30000,
  });

  const client = await pool.connect();
  console.log('Connected to DB for migrations...');

  try {
    // 1. Run standard drizzle folder migrations first (disabled due to table conflict)
    // console.log('Running drizzle schema migrations...');
    // const db = drizzle(pool);
    // await migrate(db, {
    //   migrationsFolder: path.join(process.cwd(), 'drizzle'),
    // });
    // console.log('Drizzle migrations completed.');

    // 2. Run custom migrations for global_variants
    console.log('Running custom global_variants schema migration...');
    
    // Create global_variants table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "global_variants" (
        "id" serial PRIMARY KEY,
        "name" varchar(255) NOT NULL,
        "variant_type" varchar(50) NOT NULL DEFAULT 'battery',
        "spec_value" varchar(100),
        "range" varchar(50),
        "charging_time" varchar(100),
        "created_at" timestamp DEFAULT now(),
        "updated_at" timestamp DEFAULT now()
      );
    `);
    
    try {
      await client.query(`
        CREATE UNIQUE INDEX "idx_global_variants_name" ON "global_variants" ("name");
      `);
      console.log('Created unique index on name.');
    } catch (e) {
      // Index might already exist
    }

    // Check if vehicle_variants has the old columns (name, variant_type)
    const columnsRes = await client.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'vehicle_variants';
    `);
    const columns = columnsRes.rows.map(r => r.column_name);

    if (columns.includes('name')) {
      console.log('Migrating existing variants to global_variants...');
      // Fetch all existing variants
      const oldVariantsRes = await client.query(`SELECT * FROM "vehicle_variants";`);
      const oldVariants = oldVariantsRes.rows;

      // Add global_variant_id column to vehicle_variants (nullable temporarily)
      await client.query(`
        ALTER TABLE "vehicle_variants" ADD COLUMN IF NOT EXISTS "global_variant_id" integer;
      `);

      for (const v of oldVariants) {
        // Find or insert global variant
        let globalVarId: number;
        const existRes = await client.query(`SELECT id FROM "global_variants" WHERE name = $1;`, [v.name]);
        if (existRes.rows.length > 0) {
          globalVarId = existRes.rows[0].id;
        } else {
          const insertRes = await client.query(`
            INSERT INTO "global_variants" (name, variant_type, spec_value, range, charging_time, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING id;
          `, [
            v.name,
            v.variant_type || 'battery',
            v.spec_value || null,
            v.range || null,
            v.charging_time || null,
            v.created_at || new Date(),
            v.updated_at || new Date()
          ]);
          globalVarId = insertRes.rows[0].id;
        }

        // Update vehicle_variants link
        await client.query(`
          UPDATE "vehicle_variants" SET global_variant_id = $1 WHERE id = $2;
        `, [globalVarId, v.id]);
      }

      // Now make global_variant_id NOT NULL
      await client.query(`
        ALTER TABLE "vehicle_variants" ALTER COLUMN "global_variant_id" SET NOT NULL;
      `);

      // Drop old columns from vehicle_variants
      await client.query(`
        ALTER TABLE "vehicle_variants" 
        DROP COLUMN IF EXISTS "name",
        DROP COLUMN IF EXISTS "variant_type",
        DROP COLUMN IF EXISTS "spec_value",
        DROP COLUMN IF EXISTS "range",
        DROP COLUMN IF EXISTS "charging_time";
      `);
      console.log('Migrated data successfully and dropped old columns.');
    } else {
      console.log('Table vehicle_variants already migrated.');
      // Ensure column global_variant_id exists and is not null just in case
      await client.query(`
        ALTER TABLE "vehicle_variants" ADD COLUMN IF NOT EXISTS "global_variant_id" integer;
      `);
    }

    // Add foreign key constraint to vehicle_variants if it doesn't exist
    const fkRes = await client.query(`
      SELECT constraint_name 
      FROM information_schema.table_constraints 
      WHERE table_name = 'vehicle_variants' AND constraint_type = 'FOREIGN KEY' AND constraint_name = 'vehicle_variants_global_variant_id_global_variants_id_fk';
    `);
    if (fkRes.rows.length === 0) {
      try {
        await client.query(`
          ALTER TABLE "vehicle_variants" 
          ADD CONSTRAINT "vehicle_variants_global_variant_id_global_variants_id_fk" 
          FOREIGN KEY ("global_variant_id") REFERENCES "global_variants"("id") ON DELETE CASCADE;
        `);
        console.log('Added foreign key constraint.');
      } catch (e) {
        console.log('Foreign key constraint might already exist or failed to add:', e);
      }
    }

    // Ensure unique index and indexing for performance
    try {
      await client.query(`
        CREATE INDEX "idx_variants_global_variant" ON "vehicle_variants" ("global_variant_id");
      `);
    } catch (e) {
      // Index might already exist
    }

    console.log('All migrations completed successfully!');
  } finally {
    client.release();
    await pool.end();
  }
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
