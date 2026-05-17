import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    session.destroy();
    
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[admin-logout]', err);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
