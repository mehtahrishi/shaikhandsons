import { NextRequest, NextResponse } from 'next/server';
import { getAllBrands, createBrand, updateBrand, deleteBrand, getBrandById } from '@/lib/db/inventory';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { deleteFile } from '@/lib/storage-node';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, imageUrl } = await req.json();

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const brand = await createBrand(name.trim(), imageUrl);

    return NextResponse.json({ success: true, brand });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const brands = await getAllBrands();

    return NextResponse.json({ total: brands.length, brands });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch brands.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Missing or invalid brand ID' }, { status: 400 });
    }

    const { name, imageUrl } = await req.json();
    
    // Validate name if provided
    if (name !== undefined && (typeof name !== 'string' || name.trim().length === 0)) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const existingBrand = await getBrandById(Number(id));
    if (!existingBrand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    // If a new image is provided and it's different from the existing one, delete the old one
    if (imageUrl && existingBrand.imageUrl && imageUrl !== existingBrand.imageUrl) {
      await deleteFile(existingBrand.imageUrl);
    }

    const brand = await updateBrand(Number(id), name ? name.trim() : existingBrand.name, imageUrl);

    return NextResponse.json({ success: true, brand });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = req.nextUrl.searchParams.get('id');
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Missing or invalid brand ID' }, { status: 400 });
    }

    const brandId = Number(id);
    const existingBrand = await getBrandById(brandId);

    if (existingBrand) {
      // 1. Delete the image file if it exists
      if (existingBrand.imageUrl) {
        await deleteFile(existingBrand.imageUrl);
      }
      
      // 2. Delete from database
      await deleteBrand(brandId);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
