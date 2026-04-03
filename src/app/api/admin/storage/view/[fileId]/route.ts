import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export const runtime = 'nodejs';

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await context.params;
    if (!fileId) {
      return NextResponse.json({ error: 'Missing file ID' }, { status: 400 });
    }

    // Prevent directory traversal attacks
    if (fileId.includes('..') || fileId.includes('/')) {
      return NextResponse.json({ error: 'Invalid file ID' }, { status: 400 });
    }

    const filePath = join(UPLOADS_DIR, fileId);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    // Read file
    const fileBuffer = await readFile(filePath);

    // Determine MIME type based on file extension
    const ext = fileId.split('.').pop()?.toLowerCase();
    const mimeTypes: Record<string, string> = {
      jpg: 'image/jpeg',
      jpeg: 'image/jpeg',
      png: 'image/png',
      gif: 'image/gif',
      webp: 'image/webp',
      svg: 'image/svg+xml',
    };

    const mimeType = mimeTypes[ext || ''] || 'application/octet-stream';

    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': mimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load image file.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
