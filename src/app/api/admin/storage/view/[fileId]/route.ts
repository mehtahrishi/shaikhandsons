import { NextRequest, NextResponse } from 'next/server';
import { Client, Storage } from 'node-appwrite';

export const runtime = 'nodejs';

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

  if (!endpoint || !projectId || !apiKey || !bucketId) {
    return NextResponse.json(
      { error: 'Appwrite image environment is not configured.' },
      { status: 500 }
    );
  }

  const { fileId } = await context.params;
  if (!fileId) {
    return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
  }

  try {
    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const storage = new Storage(client);

    const [metadata, binary] = await Promise.all([
      storage.getFile({ bucketId, fileId }),
      storage.getFileView({ bucketId, fileId }),
    ]);

    return new NextResponse(binary, {
      headers: {
        'Content-Type': metadata.mimeType || 'application/octet-stream',
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load image file.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
