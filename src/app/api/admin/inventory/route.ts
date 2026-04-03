import { NextRequest, NextResponse } from 'next/server';
import { getAllVehicles, createVehicle, updateVehicle, deleteVehicle } from '@/lib/db/inventory';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

type NewVehicleData = {
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim: string;
  price: number;
  batteryRangeKm: number;
  horsepower: number;
  zeroToSixtySeconds: number;
  imageUrls: string[];
  designPhilosophy: string;
};

export async function POST(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = (await req.json()) as Partial<NewVehicleData>;

    const requiredFields = [
      'brandId',
      'make',
      'model',
      'year',
      'trim',
      'price',
      'batteryRangeKm',
      'horsepower',
      'zeroToSixtySeconds',
      'imageUrls',
      'designPhilosophy',
    ];

    for (const field of requiredFields) {
      if (field === 'brandId' && (typeof body[field as keyof NewVehicleData] !== 'number' || !body[field as keyof NewVehicleData])) {
        return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
      }
      if (
        field !== 'brandId' &&
        field !== 'imageUrls' &&
        field !== 'year' &&
        field !== 'price' &&
        field !== 'batteryRangeKm' &&
        field !== 'horsepower' &&
        field !== 'zeroToSixtySeconds'
      ) {
        const value = body[field as keyof NewVehicleData];
        if (typeof value !== 'string' || (value as string).trim().length === 0) {
          return NextResponse.json({ error: `Invalid field: ${field}` }, { status: 400 });
        }
      }
    }

    const vehicle = await createVehicle({
      brandId: body.brandId as number,
      make: (body.make as string).trim(),
      model: (body.model as string).trim(),
      year: body.year as number,
      trim: (body.trim as string).trim(),
      price: String(body.price),
      batteryRangeKm: body.batteryRangeKm as number,
      horsepower: body.horsepower as number,
      zeroToSixtySeconds: String(body.zeroToSixtySeconds),
      imageUrls: Array.isArray(body.imageUrls) ? (body.imageUrls as string[]).filter(Boolean) : [],
      designPhilosophy: (body.designPhilosophy as string).trim(),
    });

    return NextResponse.json({ success: true, vehicle });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create vehicle.';
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

    const vehicles = await getAllVehicles();

    return NextResponse.json({ total: vehicles.length, vehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch vehicles.';
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

    const body = await req.json();
    
    const id = body.id;
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Missing or invalid vehicle ID' }, { status: 400 });
    }

    // Remove id from body to avoid passing it to the database
    const { id: _, ...updateData } = body;

    const vehicle = await updateVehicle(Number(id), updateData);

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, vehicle });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update vehicle.';
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

    const body = await req.json();
    const id = body.id;
    
    if (!id || isNaN(Number(id))) {
      return NextResponse.json({ error: 'Missing or invalid vehicle ID' }, { status: 400 });
    }

    await deleteVehicle(Number(id));

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete vehicle.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
