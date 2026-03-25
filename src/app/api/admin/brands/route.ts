import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite brands database environment is not configured.' },
      { status: 500 }
    );
  }

  try {
    const { name } = await req.json();

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    const created = await databases.createDocument({
      databaseId,
      collectionId,
      documentId: ID.unique(),
      data: { name: name.trim() },
    });

    return NextResponse.json({ success: true, document: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite brands database environment is not configured.' },
      { status: 500 }
    );
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const databases = new Databases(client);

  try {
    const result = await databases.listDocuments(databaseId, collectionId);

    const brands = result.documents.map((doc) => ({
      id: doc.$id,
      name: doc.name,
      createdAt: doc.$createdAt,
    }));

    return NextResponse.json({ total: result.total, brands });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch brands.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite brands database environment is not configured.' },
      { status: 500 }
    );
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  try {
    const { name } = await req.json();
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    const updated = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      { name: name.trim() }
    );

    return NextResponse.json({ success: true, document: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId = process.env.NEXT_PUBLIC_APPWRITE_BRANDS_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite brands database environment is not configured.' },
      { status: 500 }
    );
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    await databases.deleteDocument(databaseId, collectionId, id);

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
