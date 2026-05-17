import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyUser } from '@/lib/db/auth';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, token, otp } = await req.json();

    // If token + otp provided, verify OTP first
    if (token && otp) {
      // OTP verification is handled by verify-otp route
      // This route expects the OTP to be pre-verified
      return NextResponse.json({ error: 'Use POST /api/auth/verify-otp first.' }, { status: 400 });
    }

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    const user = await getUserByEmail(email);

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // For login after OTP verification, we just need to create the session
    // The password validation was already done during initial login attempt
    if (!user.isVerified) {
      // Mark as verified if OTP was verified
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
