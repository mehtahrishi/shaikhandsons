
import { NextRequest, NextResponse } from 'next/server';

/**
 * @fileOverview Secure API route for administrative authentication.
 * Validates credentials against environment variables.
 */

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: 'Admin credentials not configured in environment.' },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      // In a production app, you would set a secure HTTP-only cookie here.
      // For this prototype, we return a success signal.
      return NextResponse.json({ 
        success: true, 
        user: { name: 'Fleet Master', email: adminEmail, role: 'ADMIN' } 
      });
    }

    return NextResponse.json(
      { error: 'Authorization Denied. Invalid credentials.' },
      { status: 401 }
    );
  } catch (err) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
