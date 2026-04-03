import { NextRequest, NextResponse } from 'next/server';
import { updateVehicle } from '@/lib/db/inventory';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';

export const runtime = 'nodejs';

export async function PATCH(req: NextRequest) {
  try {
    // Check admin authentication
    const authenticated = await isAdminAuthenticated(req);
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const { vehicleIds, updates } = body;

    if (!Array.isArray(vehicleIds) || vehicleIds.length === 0) {
      return NextResponse.json({ error: 'Missing or invalid vehicleIds array' }, { status: 400 });
    }

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json({ error: 'Missing or invalid updates object' }, { status: 400 });
    }

    // Update each vehicle with the same updates
    const results = [];
    const errors = [];

    for (const id of vehicleIds) {
      try {
        const vehicleId = Number(id);
        if (isNaN(vehicleId)) {
          errors.push({ id, error: 'Invalid vehicle ID' });
          continue;
        }

        const vehicle = await updateVehicle(vehicleId, {
          ...updates,
          price: updates.price ? String(updates.price) : undefined,
        });

        if (!vehicle) {
          errors.push({ id, error: 'Vehicle not found' });
          continue;
        }

        results.push({ id, success: true, vehicle });
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update vehicle';
        errors.push({ id, error: message });
      }
    }

    const successCount = results.length;
    const failureCount = errors.length;

    return NextResponse.json({
      success: true,
      summary: {
        total: vehicleIds.length,
        updated: successCount,
        failed: failureCount,
      },
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to bulk update vehicles.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
