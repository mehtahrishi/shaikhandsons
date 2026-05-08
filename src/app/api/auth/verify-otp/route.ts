import { NextRequest, NextResponse } from 'next/server';
import { verifyOtpToken } from '@/lib/auth/otp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { token, otp } = await req.json();

    if (!token || !otp) {
      return NextResponse.json({ error: 'Token and OTP are required.' }, { status: 400 });
    }

    const result = verifyOtpToken(token, otp);

    if (!result.valid) {
      let errorMsg = 'Invalid verification code.';
      if (result.reason === 'expired') errorMsg = 'Code has expired. Please request a new one.';
      if (result.reason === 'wrong_otp') errorMsg = 'Incorrect code. Please try again.';
      return NextResponse.json({ error: errorMsg }, { status: 400 });
    }

    return NextResponse.json({ success: true, email: result.email });
  } catch (err) {
    console.error('[verify-otp]', err);
    return NextResponse.json({ error: 'Verification failed.' }, { status: 500 });
  }
}
