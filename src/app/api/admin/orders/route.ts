import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import { getAllOrders, updateOrderStatus } from '@/lib/db/orders';
import { updateOrderStatusSchema } from '@/lib/validations';

export const runtime = 'nodejs';

/**
 * GET /api/admin/orders
 * Returns all orders, optional ?status=pending|confirmed|completed|cancelled filter
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get('status') || undefined;

    const orderList = await getAllOrders(statusFilter);
    return NextResponse.json({ orders: orderList });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch orders';
    console.error('[GET /api/admin/orders]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/orders
 * Updates order status and optional admin notes
 */
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateOrderStatusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, status, adminNotes } = parsed.data;
    const updated = await updateOrderStatus(id, status, adminNotes);

    if (!updated) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update order';
    console.error('[PATCH /api/admin/orders]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
