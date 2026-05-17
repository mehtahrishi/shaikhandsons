import { NextRequest, NextResponse } from 'next/server';
import { getUserById } from '@/lib/db/auth';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    // Get user from database
    const user = await getUserById(session.userId);

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        phone: user.phone,
        address: user.address,
        isVerified: user.isVerified,
      },
    });
  } catch (err) {
    console.error('[me]', err);
    return NextResponse.json({ user: null }, { status: 200 });
  }
}
