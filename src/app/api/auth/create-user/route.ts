import { NextRequest, NextResponse } from 'next/server';
import { createUser, hashPassword, getUserByEmail } from '@/lib/db/auth';
import { signUpSchema } from '@/lib/validations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Validation using Zod
    const result = signUpSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: result.error.errors[0].message }, { status: 400 });
    }

    const { email, password, fullName } = result.data;
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
