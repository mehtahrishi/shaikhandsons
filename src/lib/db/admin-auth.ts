import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

/**
 * Validate admin credentials against environment variables
 */
export async function validateAdminCredentials(email: string, password: string): Promise<boolean> {
  const envEmail = process.env.ADMIN_EMAIL;
  const envPassword = process.env.ADMIN_PASSWORD;

  if (!envEmail || !envPassword) {
    console.error('❌ ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env.local');
    return false;
  }

  // Case-insensitive email comparison
  const emailMatch = email.toLowerCase() === envEmail.toLowerCase();
  const passwordMatch = password === envPassword;

  return emailMatch && passwordMatch;
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
