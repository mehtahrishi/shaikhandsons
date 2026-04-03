import { config } from 'dotenv';
import { db } from './index';
import { adminUsers } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

config({ path: '.env.local' });

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    process.exit(1);
  }

  try {
    // Check if admin already exists
    const existingAdmin = await db.query.adminUsers.findFirst({
      where: eq(adminUsers.email, adminEmail.toLowerCase()),
    });

    if (existingAdmin) {
      console.log(`✅ Admin ${adminEmail} already exists`);
      process.exit(0);
    }

    // Hash password
    const passwordHash = await bcrypt.hash(adminPassword, 10);

    // Create admin user
    const result = await db
      .insert(adminUsers)
      .values({
        email: adminEmail.toLowerCase(),
        passwordHash,
      })
      .returning();

    console.log(`✅ Admin user created: ${result[0].email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to seed admin:', err);
    process.exit(1);
  }
}

seedAdmin();
