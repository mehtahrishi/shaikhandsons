import { NextRequest, NextResponse } from 'next/server';
import { updateUserProfile, getUserById } from '@/lib/db/auth';
import jwt from 'jsonwebtoken';

interface JWTPayload {
  userId: number;
  email: string;
  iat: number;
  exp: number;
}

export async function POST(req: NextRequest) {
  try {
    // Get token from cookie
    let token = req.cookies.get('auth-token')?.value;

    if (!token) {
      const authHeader = req.headers.get('Authorization');
      if (authHeader?.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify and decode token
    const secret = process.env.OTP_JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ error: 'JWT secret not configured' }, { status: 500 });
    }

    const decoded = jwt.verify(token, secret) as JWTPayload;
    const userId = decoded.userId;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const body = await req.json();
    const { phone, address, fullName } = body;

    // Update user profile
    const updatedUser = await updateUserProfile(userId, phone, address, fullName);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        phone: updatedUser.phone,
        address: updatedUser.address,
        isVerified: updatedUser.isVerified,
      },
    });
  } catch (error: any) {
    console.error('[update-profile] Error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
