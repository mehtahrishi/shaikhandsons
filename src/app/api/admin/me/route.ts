import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getAdminSession();

    if (!session.adminEmail) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        email: session.adminEmail,
        role: session.role,
      },
    });
  } catch (err) {
    console.error('[admin-me]', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
