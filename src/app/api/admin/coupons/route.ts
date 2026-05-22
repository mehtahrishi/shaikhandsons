import { NextRequest, NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/db/admin-auth';
import {
  getAllCoupons,
  getCouponByCode,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '@/lib/db/coupons';
import { createCouponSchema, updateCouponSchema } from '@/lib/validations';

export const runtime = 'nodejs';

/**
 * GET /api/admin/coupons
 * Returns all coupons
 */
export async function GET(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const couponList = await getAllCoupons();
    return NextResponse.json({ coupons: couponList });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch coupons';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/admin/coupons
 * Creates a new coupon
 */
export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = createCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Check for duplicate code
    const existing = await getCouponByCode(data.code);
    if (existing) {
      return NextResponse.json({ error: `Coupon code "${data.code}" already exists.` }, { status: 409 });
    }

    const coupon = await createCoupon({
      code: data.code,
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue.toString(),
      maxDiscountAmount: data.maxDiscountAmount?.toString() ?? null,
      minOrderValue: data.minOrderValue?.toString() ?? null,
      usageLimit: data.usageLimit ?? null,
      perUserLimit: data.perUserLimit,
      validFrom: data.validFrom ? new Date(data.validFrom) : undefined,
      validUntil: data.validUntil ? new Date(data.validUntil) : null,
      isActive: data.isActive,
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create coupon';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/admin/coupons
 * Updates an existing coupon (pass id in body)
 */
export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = updateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { id, ...rest } = parsed.data;
    const updated = await updateCoupon(id, {
      ...rest,
      discountValue: rest.discountValue?.toString(),
      maxDiscountAmount: rest.maxDiscountAmount?.toString() ?? null,
      minOrderValue: rest.minOrderValue?.toString() ?? null,
      validFrom: rest.validFrom ? new Date(rest.validFrom) : undefined,
      validUntil: rest.validUntil ? new Date(rest.validUntil) : null,
    } as any);

    return NextResponse.json({ success: true, coupon: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update coupon';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * DELETE /api/admin/coupons?id=X
 */
export async function DELETE(req: NextRequest) {
  if (!(await isAdminAuthenticated(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const id = Number(new URL(req.url).searchParams.get('id'));
    if (!id) return NextResponse.json({ error: 'Missing id' }, { status: 400 });

    const deleted = await deleteCoupon(id);
    if (!deleted) return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });

    return NextResponse.json({ success: true });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete coupon';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
