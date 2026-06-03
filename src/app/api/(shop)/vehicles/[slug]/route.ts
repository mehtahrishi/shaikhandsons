import { NextRequest, NextResponse } from 'next/server';
import { getVehicleBySlug, getVehicleById } from '@/lib/db/inventory';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;

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

    // If it is a child vehicle, return the parent vehicle with information about this child preselected
    if (vehicle.parentId) {
      const parentVehicle = await getVehicleById(vehicle.parentId);
      if (parentVehicle) {
        return NextResponse.json({
          vehicle: parentVehicle,
          initialColorVariantId: vehicle.id
        });
      }
    }

    return NextResponse.json({ vehicle });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicle.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
