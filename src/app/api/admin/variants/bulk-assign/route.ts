import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { bulkAssignVariants } from '@/lib/db/variants';

export const runtime = 'nodejs';

/**
 * POST /api/admin/variants/bulk-assign
 * Body: { vehicleId: number, globalVariantIds: number[] }
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { vehicleId, globalVariantIds } = await req.json();

    if (!vehicleId || !Array.isArray(globalVariantIds)) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const variants = await bulkAssignVariants(vehicleId, globalVariantIds);

    return NextResponse.json({ success: true, variants });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to bulk assign variants';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
