import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getVehicleBySlug, getVehicleById } from '@/lib/db/inventory';
import { getVariantById } from '@/lib/db/variants';
import { validateCoupon, calculateDiscount, incrementCouponUsage } from '@/lib/db/coupons';
import { createOrder } from '@/lib/db/orders';
import { createOrderSchema } from '@/lib/validations';

export const runtime = 'nodejs';

/**
 * POST /api/vehicles/[slug]/order
 * Creates a booking/reservation. Session optional (guest bookings allowed).
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;

    // Parse and validate body
    const body = await req.json();
    const parsed = createOrderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request', details: parsed.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Resolve vehicle
    let vehicle = await getVehicleBySlug(identifier);
    if (!vehicle && /^\d+$/.test(identifier)) {
      vehicle = await getVehicleById(Number(identifier));
    }
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    // Get user session (required)
    const session = await getSession();
    const userId = session?.userId;
    if (!userId) {
      return NextResponse.json(
        { error: 'Authentication required. Please log in or create an account to place an order or book a session.' },
        { status: 401 }
      );
    }

    // Resolve variant if specified
    let variantName: string | null = null;
    let orderPrice = Number(vehicle.price);

    if (data.variantId) {
      const variant = await getVariantById(data.variantId);
      if (variant && variant.vehicleId === vehicle.id) {
        variantName = variant.name;
        orderPrice = Number(vehicle.price) + Number(variant.price);
      }
    }

    // Apply coupon if provided
    let couponId: number | null = null;
    let couponCode: string | null = null;
    let discountAmount = 0;
    let finalPrice = orderPrice;

    if (data.couponCode) {
      try {
        const coupon = await validateCoupon(data.couponCode, orderPrice, userId ?? undefined);
        discountAmount = calculateDiscount(coupon as any, orderPrice);
        finalPrice = Math.max(0, orderPrice - discountAmount);
        couponId = coupon.id;
        couponCode = coupon.code;
      } catch (couponErr: any) {
        return NextResponse.json({ error: couponErr.message }, { status: 400 });
      }
    }

    // Create order
    const order = await createOrder({
      userId,
      vehicleId: vehicle.id,
      vehicleSlug: vehicle.slug ?? identifier,
      vehicleName: `${vehicle.make} ${vehicle.model}`,
      variantId: data.variantId ?? null,
      variantName,
      vehiclePrice: orderPrice.toString(),
      couponId,
      couponCode,
      discountAmount: discountAmount.toString(),
      finalPrice: finalPrice.toString(),
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail || undefined,
      preferredShowroom: data.preferredShowroom,
      preferredDate: data.preferredDate,
      orderType: data.orderType,
    });

    // Increment coupon usage count
    if (couponId) {
      await incrementCouponUsage(couponId);
    }

    return NextResponse.json({ success: true, orderId: order.id, order }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create order';
    console.error('[POST /api/vehicles/[slug]/order]', err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
