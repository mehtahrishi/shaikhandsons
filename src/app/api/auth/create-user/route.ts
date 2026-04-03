import { NextRequest, NextResponse } from 'next/server';
import { createUser, hashPassword, getUserByEmail } from '@/lib/db/auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { email, password, fullName } = await req.json();

    // Validation
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters.' }, { status: 400 });
    }

    const trimmedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existingUser = await getUserByEmail(trimmedEmail);
    if (existingUser) {
      return NextResponse.json({ error: 'This email is already registered.' }, { status: 409 });
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user in PostgreSQL
    const user = await createUser(trimmedEmail, passwordHash, fullName);

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[create-user]', err);
    return NextResponse.json({ error: 'Failed to create account. Please try again.' }, { status: 500 });
  }
}
