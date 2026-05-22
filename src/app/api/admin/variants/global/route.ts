import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { 
  getAllGlobalVariants, 
  createGlobalVariant, 
  updateGlobalVariant, 
  deleteGlobalVariant 
} from '@/lib/db/variants';
import { z } from 'zod';

export const runtime = 'nodejs';

const globalVariantSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  variantType: z.enum(['battery', 'engine', 'trim', 'ev', 'petrol', 'gas']),
  price: z.number().nonnegative('Price must be positive or zero').default(0),
  chargingTime: z.string().nullable().optional(),
});

const updateGlobalVariantSchema = globalVariantSchema.extend({
  id: z.number(),
});

/**
 * GET /api/admin/variants/global
 * Returns all global variants in the system (for dropdown select list in admin panel)
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const globalVariants = await getAllGlobalVariants();
    return NextResponse.json({ globalVariants });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch global variants';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/variants/global
 * Creates a new global variant preset
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = globalVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const newPreset = await createGlobalVariant(parsed.data);
    return NextResponse.json({ success: true, globalVariant: newPreset }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create global variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/variants/global
 * Updates an existing global variant preset
 */
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateGlobalVariantSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, ...data } = parsed.data;
    const updatedPreset = await updateGlobalVariant(id, data);
    return NextResponse.json({ success: true, globalVariant: updatedPreset });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update global variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/variants/global?id=X
 * Deletes a global variant preset
 */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id || isNaN(id)) {
      return NextResponse.json({ error: 'Missing or invalid global variant ID' }, { status: 400 });
    }

    await deleteGlobalVariant(id);
    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete global variant';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
