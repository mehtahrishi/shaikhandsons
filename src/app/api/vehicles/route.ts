import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicles } from '@/lib/db/inventory';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const vehicles = await getAllVehicles();
    return NextResponse.json({ total: vehicles.length, vehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicles.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
