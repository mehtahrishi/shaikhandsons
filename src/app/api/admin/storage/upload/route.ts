import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { existsSync } from 'fs';
import crypto from 'crypto';

export const runtime = 'nodejs';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

const UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Ensures upload directory exists
 */
async function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    await mkdir(UPLOADS_DIR, { recursive: true });
  }
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure uploads directory exists
    await ensureUploadsDir();

    const formData = await req.formData();
    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const uploadedFiles = [] as Array<{ id: string; url: string; name: string }>;

    for (const file of files) {
      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: `File size exceeds ${MAX_FILE_SIZE / 1024 / 1024}MB limit` },
          { status: 413 }
        );
      }

      // Validate file type (images only)
      if (!file.type.startsWith('image/')) {
        return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
      }

      // Generate unique filename
      const extension = file.name.split('.').pop();
      const uniqueName = `${crypto.randomBytes(16).toString('hex')}.${extension}`;
      const filePath = join(UPLOADS_DIR, uniqueName);

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Write file to disk
      await writeFile(filePath, buffer);

      // Return file URL
      const fileUrl = `/uploads/${uniqueName}`;
      uploadedFiles.push({ id: uniqueName, url: fileUrl, name: file.name });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload image(s).';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
