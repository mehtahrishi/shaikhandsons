const BUCKET_ID = process.env.NEXT_PUBLIC_APPWRITE_BUCKET_ID;

export async function uploadVehicleImage(file: File) {
  const urls = await uploadVehicleImages([file]);
  return urls[0] ?? '';
}

export async function uploadVehicleImages(files: File[]) {
  if (!BUCKET_ID) {
    throw new Error('Appwrite Bucket ID is not configured in environment variables.');
  }

  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();
  files.forEach((file) => formData.append('files', file));

  const response = await fetch('/api/admin/storage/upload', {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error || 'Failed to upload image(s).');
  }

  if (!Array.isArray(data.files)) {
    throw new Error('Upload response is invalid.');
  }

  return data.files
    .map((file: { url?: string }) => file.url)
    .filter((url: string | undefined): url is string => Boolean(url));
}
