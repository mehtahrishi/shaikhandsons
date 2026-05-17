import { NextRequest } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';

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
 * Check if request is from authenticated admin
 */
export async function isAdminAuthenticated(req?: NextRequest): Promise<boolean> {
  try {
    const session = await getAdminSession();
    return session.role === 'ADMIN';
  } catch {
    return false;
  }
}
