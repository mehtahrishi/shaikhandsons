import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import {
  getAllVariantsByVehicleId,
  createVariant,
  updateVariant,
  deleteVariant,
} from '@/lib/db/variants';
import { getVariantsByVehicleId } from '@/lib/db/variants';
import { createVariantSchema, updateVariantSchema } from '@/lib/validations';

export const runtime = 'nodejs';

/**
 * GET /api/admin/variants?vehicleId=X
 * Returns all variants (including unavailable) for a vehicle
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const vehicleId = Number(new URL(req.url).searchParams.get('vehicleId'));
  if (!vehicleId) return NextResponse.json({ error: 'Missing vehicleId' }, { status: 400 });

  try {
    const variants = await getAllVariantsByVehicleId(vehicleId);
    return NextResponse.json({ variants });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch variants' }, { status: 500 });
  }
}

/**
 * POST /api/admin/variants
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;
    const variant = await createVariant({
      vehicleId: data.vehicleId,
      name: data.name,
      variantType: data.variantType,
      price: data.price.toString(),
      chargingTime: data.chargingTime ?? undefined,
      isDefault: data.isDefault,
      isAvailable: data.isAvailable,
      sortOrder: data.sortOrder,
      globalVariantId: data.globalVariantId,
    });

    return NextResponse.json({ success: true, variant }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/variants
 */
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, price, ...rest } = parsed.data;
    const updated = await updateVariant(id, {
      ...rest,
      price: price?.toString(),
    } as any);

    return NextResponse.json({ success: true, variant: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/variants?id=X
 */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const deleted = await deleteVariant(id);
    if (!deleted) return NextResponse.json({ error: 'Variant not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
