import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAdminToken } from '@/lib/db/admin-auth';
import { adminLoginSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation using Zod
    const result = adminLoginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }
    
    const { email, password } = result.data;

    // Validate against env variables
    const isValid = await validateAdminCredentials(email, password);

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Check if JWT secret is configured
    if (!process.env.OTP_JWT_SECRET) {
      return NextResponse.json({ error: 'Server configuration error.' }, { status: 500 });
    }

    // Create JWT token
    const token = createAdminToken(email.toLowerCase());

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

    return response;
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[admin-auth] Error:', errorMessage, err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
