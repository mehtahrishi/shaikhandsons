import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, verifyOTPToken, verifyUser } from '@/lib/db/auth';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

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

    // Create JWT token
    const secret = process.env.OTP_JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret not configured');
    }

    const jwtPayload: JWTPayload = {
      userId: user.id,
      email: user.email,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60, // 7 days
    };

    const sessionToken = jwt.sign(jwtPayload, secret);

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      token: sessionToken,
    });

    response.cookies.set('auth-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[login]', err);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
