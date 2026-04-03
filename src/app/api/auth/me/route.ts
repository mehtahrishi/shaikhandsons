import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/db/auth';
import jwt from 'jsonwebtoken';

export const runtime = 'nodejs';

interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function GET(req: NextRequest) {
  try {
    // Get token from cookie or Authorization header
    let token = req.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Verify JWT
    const secret = process.env.OTP_JWT_SECRET;
    if (!secret) {
      throw new Error('JWT secret not configured');
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;

    // Get user from database
    const user = await getUserById(decoded.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
