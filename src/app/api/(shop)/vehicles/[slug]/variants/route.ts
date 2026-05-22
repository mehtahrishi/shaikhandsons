import { NextRequest, NextResponse } from 'next/server';
import { getVehicleBySlug, getVehicleById } from '@/lib/db/inventory';
import { getVariantsByVehicleId } from '@/lib/db/variants';

export const runtime = 'nodejs';

/**
 * GET /api/vehicles/[slug]/variants
 * Public endpoint: returns available (non-hidden) variants for a vehicle
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;

    let vehicle = await getVehicleBySlug(identifier);
    if (!vehicle && /^\d+$/.test(identifier)) {
      vehicle = await getVehicleById(Number(identifier));
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const variants = await getVariantsByVehicleId(vehicle.id);
    return NextResponse.json({ variants });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch variants';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
