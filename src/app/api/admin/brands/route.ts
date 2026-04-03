import { NextRequest, NextResponse } from 'next/server';
import { getAllBrands, createBrand, updateBrand, deleteBrand } from '@/lib/db/inventory';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name } = await req.json();

    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const brand = await createBrand(name.trim());

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

    const { name } = await req.json();
    if (typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Invalid brand name' }, { status: 400 });
    }

    const brand = await updateBrand(Number(id), name.trim());

    if (!brand) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

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

    await deleteBrand(Number(id));

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete brand.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
