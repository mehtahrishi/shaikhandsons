import { NextRequest, NextResponse } from 'next/server';
import { Client, ID, Permission, Role, Storage } from 'node-appwrite';
import { InputFile } from 'node-appwrite/file';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
  const projectId = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
  const apiKey = process.env.APPWRITE_API_KEY;
  const bucketId = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

  if (!endpoint || !projectId || !apiKey || !bucketId) {
    return NextResponse.json(
      { error: 'Appwrite upload environment is not configured.' },
      { status: 500 }
    );
  }

  try {
    const formData = await req.formData();
    const files = formData
      .getAll('files')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (files.length === 0) {
      return NextResponse.json({ error: 'No files provided.' }, { status: 400 });
    }

    const client = new Client().setEndpoint(endpoint).setProject(projectId).setKey(apiKey);
    const storage = new Storage(client);

    const uploadedFiles = [] as Array<{ id: string; url: string; name: string }>;

    for (const file of files) {
      const fileBuffer = Buffer.from(await file.arrayBuffer());
      const inputFile = InputFile.fromBuffer(fileBuffer, file.name);

      const uploaded = await storage.createFile({
        bucketId,
        fileId: ID.unique(),
        file: inputFile,
        permissions: [Permission.read(Role.any())],
      });

      const url = `/api/admin/storage/view/${uploaded.$id}`;
      uploadedFiles.push({ id: uploaded.$id, url, name: uploaded.name });
    }

    return NextResponse.json({ files: uploadedFiles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to upload image(s).';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
