import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicles, getVehicleById } from '@/lib/db/inventory';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id && !isNaN(Number(id))) {
      const vehicle = await getVehicleById(Number(id));
      return NextResponse.json({ total: vehicle ? 1 : 0, vehicles: vehicle ? [vehicle] : [] });
    }

    const allVehicles = await getAllVehicles();
    const vehicles = allVehicles.filter(v => v.parentId === null);
    return NextResponse.json({ total: vehicles.length, vehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicles.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
