import { NextRequest, NextResponse } from 'next/server';
import { Client, Databases, ID } from 'node-appwrite';

export const runtime = 'nodejs';

type NewVehicleData = {
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  images: string[];
  designPhilosophy: string;
};

function normalizeImageUrl(url: unknown): string {
  if (typeof url !== 'string' || !url.trim()) {
    return '';
  }

  if (url.startsWith('/api/admin/storage/view/')) {
    return url;
  }

  const match = url.match(/\/files\/([^/?#]+)\/(view|preview)/i);
  if (match && match[1]) {
    return `/api/admin/storage/view/${match[1]}`;
  }

  return url;
}

export async function POST(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NAME ||
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite database environment is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = (await req.json()) as Partial<NewVehicleData>;

    const requiredTextFields: Array<keyof NewVehicleData> = [
      'make',
      'model',
      'trim',
      'designPhilosophy',
    ];

    for (const field of requiredTextFields) {
      const value = body[field];
      if (typeof value !== 'string' || value.trim().length === 0) {
        return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
      }
    }

    const requiredNumberFields: Array<keyof NewVehicleData> = [
      'year',
      'price',
      'batteryRangeKm',
      'horsepower',
      'zeroToSixtySeconds',
    ];

    for (const field of requiredNumberFields) {
      const value = body[field];
      if (typeof value !== 'number' || Number.isNaN(value)) {
        return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
      }
    }

    if (!Array.isArray(body.images) || body.images.length === 0) {
      return NextResponse.json({ error: 'Invalid field: images' }, { status: 400 });
    }

    const data: NewVehicleData = {
      make: body.make as string,
      model: body.model as string,
      year: body.year as number,
      trim: body.trim as string,
      price: body.price as number,
      batteryRangeKm: body.batteryRangeKm as number,
      horsepower: body.horsepower as number,
      zeroToSixtySeconds: body.zeroToSixtySeconds as number,
      images: body.images,
      designPhilosophy: body.designPhilosophy as string,
    };

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    const created = await databases.createDocument({
      databaseId,
      collectionId,
      documentId: ID.unique(),
      data,
    });

    return NextResponse.json({ success: true, document: created });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create vehicle document.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NAME ||
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite database environment is not configured.' },
      { status: 500 }
    );
  }

  const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
  const databases = new Databases(client);

  try {
    const result = await databases.listDocuments(databaseId, collectionId);

    const vehicles = result.documents.map((doc) => ({
      id: doc.$id,
      make: doc.make,
      model: doc.model,
      year: doc.year,
      trim: doc.trim,
      price: doc.price,
      batteryRangeKm: doc.batteryRangeKm,
      horsepower: doc.horsepower,
      zeroToSixtySeconds: doc.zeroToSixtySeconds,
      images: Array.isArray(doc.images)
        ? doc.images.map((url: unknown) => normalizeImageUrl(url)).filter(Boolean)
        : [],
      designPhilosophy: doc.designPhilosophy,
      createdAt: doc.$createdAt,
    }));

    return NextResponse.json({ total: result.total, vehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicles.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NAME ||
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite database environment is not configured.' },
      { status: 500 }
    );
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing document ID' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const databases = new Databases(client);

    const updated = await databases.updateDocument(
      databaseId,
      collectionId,
      id,
      body
    );

    return NextResponse.json({ success: true, document: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update vehicle document.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const databaseId = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
  const collectionId =
    process.env.NEXT_PUBLIC_APPWRITE_DATABASE_COLLECTION_NAME ||
    process.env.NEXT_PUBLIC_APPWRITE_COLLECTION_ID;

  if (!endpoint || !projectId || !apiKey || !databaseId || !collectionId) {
    return NextResponse.json(
      { error: 'Appwrite database environment is not configured.' },
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
    const message = err instanceof Error ? err.message : 'Failed to delete vehicle document.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
