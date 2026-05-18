import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyUser, comparePassword } from '@/lib/db/auth';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // CRITICAL: Re-verify password hash even after OTP
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    if (!user.isVerified) {
      // Mark as verified if they successfully passed OTP + Login
      await verifyUser(user.id);
    }

    // Create session using iron-session
    const session = await getSession();
    session.userId = user.id;
    session.email = user.email;
    session.fullName = user.fullName;
    await session.save();

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });

    return response;
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
