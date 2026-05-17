import { unlink } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

const BASE_UPLOADS_DIR = join(process.cwd(), 'public');

/**
 * Deletes a file from the public directory given its relative URL
 * Example: /uploads/brands/abc.webp -> public/uploads/brands/abc.webp
 */
export async function deleteFile(fileUrl: string): Promise<boolean> {
  try {
    if (!fileUrl || !fileUrl.startsWith('/')) return false;
    
    // Safety check: only allow deleting from uploads folder
    if (!fileUrl.startsWith('/uploads/')) return false;

    const filePath = join(BASE_UPLOADS_DIR, fileUrl);
    
    if (existsSync(filePath)) {
      await unlink(filePath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to delete file: ${fileUrl}`, error);
    return false;
  }
}
