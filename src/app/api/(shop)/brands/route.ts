import { NextRequest, NextResponse } from 'next/server';
import { getAllBrands } from '@/lib/db/inventory';

export const runtime = 'nodejs';

/**
 * GET: Returns all brands (Publicly accessible)
 */
export async function GET(req: NextRequest) {
  try {
    const brands = await getAllBrands();
    return NextResponse.json({ total: brands.length, brands });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch brands.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
