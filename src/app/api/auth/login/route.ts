import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyUser } from '@/lib/db/auth';
import { getSession } from '@/lib/auth/session';
import { verifyPreAuthToken } from '@/lib/auth/otp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, preAuthToken } = await req.json();

    if (!email || !preAuthToken) {
      return NextResponse.json({ error: 'Email and Pre-Auth token are required.' }, { status: 400 });
    }

    // 1. Verify the Pre-Auth token (proves they entered correct password earlier)
    const preAuthResult = verifyPreAuthToken(preAuthToken);
    if (!preAuthResult.valid || preAuthResult.email !== email.toLowerCase().trim()) {
      return NextResponse.json({ error: 'Session expired. Please login again.' }, { status: 401 });
    }

    // 2. Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 401 });
    }

    if (!user.isVerified) {
      // Mark as verified if they successfully passed OTP + Pre-Auth
      await verifyUser(user.id);
    }

    // 3. Create session using iron-session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.fullName = user.fullName;
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
