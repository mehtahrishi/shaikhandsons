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

    const body = (await req.json());

    // Basic required fields validation
    if (!body.brandId || !body.make || !body.model || !body.price) {
       return NextResponse.json({ error: 'Missing required fields (brandId, make, model, price)' }, { status: 400 });
    }

    const vehicle = await createVehicle({
      brandId: Number(body.brandId),
      make: String(body.make).trim(),
      model: String(body.model).trim(),
      year: Number(body.year) || new Date().getFullYear(),
      trim: body.trim ? String(body.trim).trim() : null,
      price: String(body.price),
      
      modelCode: body.modelCode ? String(body.modelCode).trim() : null,
      category: body.category ? String(body.category).trim() : null,
      shortDescription: body.shortDescription ? String(body.shortDescription).trim() : null,
      
      topSpeed: body.topSpeed ? String(body.topSpeed).trim() : null,
      certifiedRange: body.certifiedRange ? String(body.certifiedRange).trim() : null,
      realWorldRange: body.realWorldRange ? String(body.realWorldRange).trim() : null,
      ridingModes: Array.isArray(body.ridingModes) ? body.ridingModes : [],
      climbingDegree: body.climbingDegree ? String(body.climbingDegree).trim() : null,
      loadCapacity: body.loadCapacity ? String(body.loadCapacity).trim() : null,
      
      batteryType: body.batteryType ? String(body.batteryType).trim() : null,
      batteryCapacity: body.batteryCapacity ? String(body.batteryCapacity).trim() : null,
      chargingTime: body.chargingTime ? String(body.chargingTime).trim() : null,
      fastCharging: !!body.fastCharging,
      chargerIncluded: body.chargerIncluded ? String(body.chargerIncluded).trim() : null,
      batteryWarranty: body.batteryWarranty ? String(body.batteryWarranty).trim() : null,
      
      motorPower: body.motorPower ? String(body.motorPower).trim() : null,
      brakingSystem: body.brakingSystem ? String(body.brakingSystem).trim() : null,
      tyreType: body.tyreType ? String(body.tyreType).trim() : null,
      wheelType: body.wheelType ? String(body.wheelType).trim() : null,
      wheelSize: body.wheelSize ? String(body.wheelSize).trim() : null,
      groundClearance: body.groundClearance ? String(body.groundClearance).trim() : null,
      
      displayType: body.displayType ? String(body.displayType).trim() : null,
      colors: Array.isArray(body.colors) ? body.colors : [],
      keyFeatures: Array.isArray(body.keyFeatures) ? body.keyFeatures : [],
      bootSpace: body.bootSpace ? String(body.bootSpace).trim() : null,

      designPhilosophy: body.designPhilosophy ? String(body.designPhilosophy).trim() : null,
      imageUrls: Array.isArray(body.imageUrls) ? body.imageUrls.filter(Boolean) : [],
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
