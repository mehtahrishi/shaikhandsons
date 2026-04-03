import { NextRequest, NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/dashboard';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const stats = await getDashboardStats();

    return NextResponse.json({ stats });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch dashboard stats.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
