import { NextRequest, NextResponse } from 'next/server';
import { mkdir } from 'fs/promises';
import { join } from 'path';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { existsSync } from 'fs';
import crypto from 'crypto';
import sharp from 'sharp';

export const runtime = 'nodejs';
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '50mb',
    },
  },
};

const BASE_UPLOADS_DIR = join(process.cwd(), 'public', 'uploads');
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

/**
 * Ensures upload directory exists
 */
async function ensureUploadsDir(folder: string = '') {
  const targetDir = join(BASE_UPLOADS_DIR, folder);
  if (!existsSync(targetDir)) {
    await mkdir(targetDir, { recursive: true });
  }
  return targetDir;
}

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const folder = searchParams.get('folder') || '';
    
    // Validate folder name to prevent directory traversal
    if (folder && !/^[a-zA-Z0-9_-]+$/.test(folder)) {
      return NextResponse.json({ error: 'Invalid folder name' }, { status: 400 });
    }

    // Ensure target directory exists
    const targetDir = await ensureUploadsDir(folder);

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

      // Generate unique filename, force webp (superior compression to JPG/PNG)
      const uniqueName = `${crypto.randomBytes(16).toString('hex')}.webp`;
      const filePath = join(targetDir, uniqueName);

      // Read file buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // Process and compress image using sharp
      await sharp(buffer)
        .rotate() // Auto-rotate based on EXIF orientation (fixes mobile uploads)
        .resize({
          width: 1920, // Max width for high-res screens
          withoutEnlargement: true, // Don't upscale small images
        })
        .webp({ 
          quality: 75, // Perfect balance: visually lossless but tiny file size
          effort: 6,   // Maximum compression effort
          lossless: false,
          smartSubsample: true 
        })
        .toFile(filePath);

      // Return file URL
      const fileUrl = folder ? `/uploads/${folder}/${uniqueName}` : `/uploads/${uniqueName}`;
      uploadedFiles.push({ id: uniqueName, url: fileUrl, name: file.name });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload image(s).';
    console.error('Upload error:', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
