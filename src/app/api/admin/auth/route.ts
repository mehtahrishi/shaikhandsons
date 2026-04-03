import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminToken } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    console.log('[admin-auth] Login attempt started');
    
    const body = await req.json();
    console.log('[admin-auth] Request body received:', { email: body.email, hasPassword: !!body.password });
    
    const { email, password } = body;

    if (!email || typeof email !== 'string') {
      console.warn('[admin-auth] Email validation failed');
      return NextResponse.json({ error: 'Email is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string') {
      console.warn('[admin-auth] Password validation failed');
      return NextResponse.json({ error: 'Password is required.' }, { status: 400 });
    }

    console.log('[admin-auth] Validating credentials...');
    // Validate against env variables
    const isValid = await validateAdminCredentials(email, password);
    console.log('[admin-auth] Credentials valid:', isValid);

    if (!isValid) {
      console.warn('[admin-auth] Invalid credentials provided');
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Check if JWT secret is configured
    if (!process.env.OTP_JWT_SECRET) {
      console.error('❌ OTP_JWT_SECRET not configured in environment');
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    console.log('[admin-auth] Creating JWT token...');
    // Create JWT token
    const token = createAdminToken(email.toLowerCase());
    console.log('[admin-auth] Token created successfully');

    // Set secure HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      user: {
        email: email.toLowerCase(),
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

    console.log('[admin-auth] Login successful for:', email.toLowerCase());
    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[admin-auth] Error:', errorMessage, err);
    return NextResponse.json({ error: 'Authentication failed.', details: errorMessage }, { status: 500 });
  }
}
