import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Clear admin token cookie
    response.cookies.delete('admin-token');

    return response;
  } catch (err) {
    console.error('[admin-logout]', err);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
