import { NextRequest, NextResponse } from 'next/server';
import { getAdminByEmail, compareAdminPassword, createAdminToken } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    // Get admin from PostgreSQL
    const admin = await getAdminByEmail(email);

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Compare password
    const passwordMatch = await compareAdminPassword(password, admin.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Create JWT token
    const token = createAdminToken(admin.email);

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: admin.email,
        role: 'ADMIN',
      },
      token,
    });

    response.cookies.set('admin-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: '/',
    });

    return response;
  } catch (err) {
    console.error('[admin-auth]', err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
