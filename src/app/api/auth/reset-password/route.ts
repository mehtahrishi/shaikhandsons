import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, getUserByEmail, comparePassword } from '@/lib/db/auth';
import { verifyOtpToken } from '@/lib/otp';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, newPassword, token } = await req.json();

    if (!email || !otp || !newPassword || !token) {
      return NextResponse.json({ error: 'Email, OTP, token, and new password are required.' }, { status: 400 });
    }

    // Verify OTP token (stateless - no DB lookup needed)
    const result = verifyOtpToken(token, otp);
    if (!result.valid) {
      let errorMsg = 'Invalid verification code.';
      if (result.reason === 'expired') errorMsg = 'Code has expired. Please request a new one.';
      if (result.reason === 'wrong_otp') errorMsg = 'Incorrect code. Please try again.';
      if (result.reason === 'invalid_signature') errorMsg = 'Invalid token.';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    // Verify email matches
    if (result.email !== email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 });
    }

    // Check if new password is different from current password
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const isSamePassword = await comparePassword(newPassword, user.passwordHash);
    if (isSamePassword) {
      return NextResponse.json({ error: 'New password must be different from current password.' }, { status: 400 });
    }

    // Update password
    const passwordHash = await hashPassword(newPassword);
    await db.update(users).set({ passwordHash }).where(eq(users.email, email.toLowerCase().trim()));

    return NextResponse.json({ success: true, message: 'Password reset successful.' });
  } catch (err) {
    console.error('[reset-password]', err);
    return NextResponse.json({ error: 'Password reset failed.' }, { status: 500 });
  }
}
