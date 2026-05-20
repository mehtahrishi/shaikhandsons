import { NextRequest, NextResponse } from 'next/server';
import { getVehicleBySlug, getVehicleById } from '@/lib/db/inventory';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const identifier = params.slug;

    if (!identifier) {
      return NextResponse.json(
        { error: 'Vehicle slug or ID is required' },
        { status: 400 }
      );
    }

    // Try to fetch by slug first
    let vehicle = await getVehicleBySlug(identifier);

    // If not found and identifier is a number, try by ID
    if (!vehicle && /^\d+$/.test(identifier)) {
      vehicle = await getVehicleById(Number(identifier));
    }

    if (!vehicle) {
      return NextResponse.json(
        { error: 'Vehicle not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ vehicle });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicle.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
