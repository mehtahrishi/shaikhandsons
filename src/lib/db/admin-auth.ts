import { db } from './index';
import { adminUsers } from './schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SALT_ROUNDS = 10;

/**
 * Get admin user by email
 */
export async function getAdminByEmail(email: string) {
  const result = await db.query.adminUsers.findFirst({
    where: eq(adminUsers.email, email.toLowerCase()),
  });
  return result || null;
}

/**
 * Hash password using bcrypt
 */
export async function hashAdminPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Compare password with hash
 */
export async function compareAdminPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Create admin JWT token
 */
export function createAdminToken(adminEmail: string): string {
  const secret = process.env.OTP_JWT_SECRET;
  if (!secret) {
    throw new Error('JWT secret not configured');
  }

  const payload = {
    adminEmail,
    role: 'ADMIN',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
  };

  return jwt.sign(payload, secret);
}

/**
 * Verify admin token
 */
export function verifyAdminToken(token: string): { adminEmail: string; role: string } | null {
  try {
    const secret = process.env.OTP_JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret not configured');
    }

    const decoded = jwt.verify(token, secret) as { adminEmail: string; role: string };
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if request is from authenticated admin
 */
export async function isAdminAuthenticated(req: NextRequest): Promise<boolean> {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.get('admin-token')?.value;

    if (!token) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return false;
    }

    const decoded = verifyAdminToken(token);
    return decoded !== null && decoded.role === 'ADMIN';
  } catch {
    return false;
  }
}
