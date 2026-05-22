import { NextRequest, NextResponse } from 'next/server';
import { validateCoupon, calculateDiscount } from '@/lib/db/coupons';
import { validateCouponSchema } from '@/lib/validations';
import { getSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

/**
 * POST /api/coupons/validate
 * Public endpoint: validates a coupon code against an order value.
 * Returns discount amount if valid.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = validateCouponSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, orderValue } = parsed.data;
    const session = await getSession();

    const coupon = await validateCoupon(code, orderValue, session.userId ?? undefined);
    const discountAmount = calculateDiscount(coupon as any, orderValue);
    const finalPrice = Math.max(0, orderValue - discountAmount);

    return NextResponse.json({
      valid: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: Number(coupon.discountValue),
        description: coupon.description,
      },
      discountAmount,
      finalPrice,
    });
  } catch (err: any) {
    // Return user-facing error message from validateCoupon
    return NextResponse.json({ valid: false, error: err.message }, { status: 400 });
  }
}
