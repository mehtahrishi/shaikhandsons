import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db/index';
import { users } from '@/lib/db/schema';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { desc } from 'drizzle-orm';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawLimit = Number(req.nextUrl.searchParams.get('limit') ?? DEFAULT_LIMIT);
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(Math.floor(rawLimit), 1), MAX_LIMIT)
      : DEFAULT_LIMIT;

    // Fetch users from PostgreSQL
    const userList = await db.query.users.findMany({
      limit,
      orderBy: [desc(users.createdAt)],
    });

    const formattedUsers = userList.map((user) => ({
      id: String(user.id),
      name: user.fullName || 'Unknown User',
      email: user.email,
      phone: user.phone || '',
      address: user.address || '',
      prefs: {
        phone: user.phone || '',
        address: user.address || '',
      },
      emailVerification: user.isVerified,
      status: user.isVerified,
      labels: user.isVerified ? ['verified'] : [],
      createdAt: user.createdAt?.toISOString() || new Date().toISOString(),
    }));

    return NextResponse.json({ total: userList.length, users: formattedUsers });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch users.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}