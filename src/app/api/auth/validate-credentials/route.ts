import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, comparePassword } from '@/lib/db/auth';
import { loginSchema } from '@/lib/validations';
import { signPreAuthToken } from '@/lib/auth/otp';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Validation using Zod
    const result = loginSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email, password } = result.data;

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // Compare password
    const passwordMatch = await comparePassword(password, user.passwordHash);

    if (!passwordMatch) {
      return NextResponse.json({ error: 'Invalid email or password.' }, { status: 401 });
    }

    // NEW: Generate a Pre-Auth token instead of sending success only
    const preAuthToken = signPreAuthToken(user.email);

    return NextResponse.json({
      success: true,
      preAuthToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  } catch (err) {
    console.error('[validate-credentials]', err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
