import { db } from './index';
import { users, otpTokens, sessions } from './schema';
import { eq, lt } from 'drizzle-orm';
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
 * Create OTP token
 */
export async function createOTPToken(email: string): Promise<string> {
  // Clean up expired tokens
  await db.delete(otpTokens).where(lt(otpTokens.expiresAt, new Date()));

  // Generate random token
  const token = crypto.randomBytes(32).toString('hex');
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP

  // Store in database with 10-minute expiry
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await db.insert(otpTokens).values({
    email: email.toLowerCase(),
    token, // Store full token
    expiresAt,
  });

  return otp; // Return just the OTP for display/sending
}

/**
 * Verify OTP token
 */
export async function verifyOTPToken(email: string, token: string): Promise<boolean> {
  const result = await db.query.otpTokens.findFirst({
    where: eq(otpTokens.email, email.toLowerCase()),
  });

  if (!result) {
    return false;
  }

  // Check if expired
  if (result.expiresAt < new Date()) {
    await db.delete(otpTokens).where(eq(otpTokens.id, result.id));
    return false;
  }

  // Delete token after verification (one-time use)
  await db.delete(otpTokens).where(eq(otpTokens.id, result.id));

  return true;
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

/**
 * Store session token
 */
export async function createSession(userId: number, tokenHash: string, expiresAt: Date) {
  return db
    .insert(sessions)
    .values({
      userId,
      tokenHash,
      expiresAt,
    })
    .returning();
}

/**
 * Verify session token
 */
export async function verifySessionToken(userId: number, tokenHash: string): Promise<boolean> {
  const result = await db.query.sessions.findFirst({
    where: eq(sessions.tokenHash, tokenHash),
  });

  if (!result || result.userId !== userId) {
    return false;
  }

  // Check if expired
  if (result.expiresAt < new Date()) {
    await db.delete(sessions).where(eq(sessions.id, result.id));
    return false;
  }

  return true;
}

/**
 * Delete session token
 */
export async function deleteSession(tokenHash: string) {
  return db.delete(sessions).where(eq(sessions.tokenHash, tokenHash));
}
