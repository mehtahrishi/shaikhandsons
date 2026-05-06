import { db } from './index';
import { users } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const SALT_ROUNDS = 10;

/**
 * Create a new user in PostgreSQL
 */
export async function createUser(email: string, passwordHash: string, fullName?: string) {
  try {
    const result = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        fullName: fullName || null,
        isVerified: false,
      })
      .returning();

    return result[0];
  } catch (error: any) {
    if (error.message?.includes('unique')) {
      throw new Error('User already exists');
    }
    throw error;
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const result = await db.query.users.findFirst({
    where: eq(users.email, email.toLowerCase()),
  });
  return result || null;
}

/**
 * Get user by ID
 */
export async function getUserById(id: number) {
  const result = await db.query.users.findFirst({
    where: eq(users.id, id),
  });
  return result || null;
}

/**
 * Hash password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Update user profile (phone, address, and fullName fields)
 */
export async function updateUserProfile(userId: number, phone?: string, address?: string, fullName?: string) {
  const updates: any = {};
  if (phone !== undefined) updates.phone = phone;
  if (address !== undefined) updates.address = address;
  if (fullName !== undefined) updates.fullName = fullName;

  if (Object.keys(updates).length === 0) {
    return getUserById(userId);
  }

  const result = await db
    .update(users)
    .set(updates)
    .where(eq(users.id, userId))
    .returning();

  return result[0];
}

/**
 * Mark user as verified
 */
export async function verifyUser(userId: number) {
  return db.update(users).set({ isVerified: true }).where(eq(users.id, userId)).returning();
}

