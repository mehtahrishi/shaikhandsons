import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials } from '@/lib/db/admin-auth';
import { adminLoginSchema } from '@/lib/validations';
import { getAdminSession } from '@/lib/auth/session';

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

    // Set admin session using iron-session
    const session = await getAdminSession();
    session.adminEmail = email.toLowerCase();
    session.role = 'ADMIN';
    await session.save();

    return NextResponse.json({
      success: true,
      user: {
        email: email.toLowerCase(),
        role: 'ADMIN',
      },
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : String(err);
    console.error('[admin-auth] Error:', errorMessage, err);
    return NextResponse.json({ error: 'Authentication failed.' }, { status: 500 });
  }
}
