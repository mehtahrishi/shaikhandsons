import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const response = NextResponse.json({ success: true });

    // Clear auth token cookie
    response.cookies.delete('auth-token');

    return response;
  } catch (err) {
    console.error('[logout]', err);
    return NextResponse.json({ error: 'Logout failed.' }, { status: 500 });
  }
}
