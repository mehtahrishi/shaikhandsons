import { NextRequest, NextResponse } from 'next/server';
import { Client, Query, Users } from 'node-appwrite';

export const runtime = 'nodejs';

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 1000;

export async function GET(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;

  if (!endpoint || !projectId || !apiKey) {
    return NextResponse.json(
      { error: 'Appwrite admin environment is not configured.' },
      { status: 500 }
    );
  }

  const rawLimit = Number(req.nextUrl.searchParams.get('limit') ?? DEFAULT_LIMIT);
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), MAX_LIMIT)
    : DEFAULT_LIMIT;

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const usersApi = new Users(client);

  try {
    const result = await usersApi.list([Query.limit(limit), Query.orderDesc('$createdAt')]);

    const users = result.users.map((user) => ({
      id: user.$id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      prefs: user.prefs || {},
      emailVerification: user.emailVerification,
      status: user.status,
      labels: user.labels ?? [],
      createdAt: user.$createdAt,
      registration: user.registration,
    }));

    return NextResponse.json({ total: result.total, users });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch Appwrite users.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}