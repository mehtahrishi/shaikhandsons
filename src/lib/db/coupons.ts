import { db } from './index';
import { coupons, orders } from './schema';
import { eq, and, sql, lte, gte, or, isNull } from 'drizzle-orm';

/**
 * Get all coupons — for admin panel
 */
export async function getAllCoupons() {
  return db
    .select()
    .from(coupons)
    .orderBy(coupons.createdAt);
}

/**
 * Get a coupon by its code (case-insensitive)
 */
export async function getCouponByCode(code: string) {
  const results = await db
    .select()
    .from(coupons)
    .where(eq(coupons.code, code.toUpperCase()));
  return results[0] ?? null;
}

/**
 * Validate a coupon: checks existence, active status, expiry, and usage limits.
 * Returns the coupon if valid, throws an Error with a user-friendly message if not.
 */
export async function validateCoupon(code: string, orderValue: number, userId?: number) {
  const coupon = await getCouponByCode(code);

  if (!coupon) throw new Error('Coupon code not found.');
  if (!coupon.isActive) throw new Error('This coupon is no longer active.');

  const now = new Date();
  if (coupon.validFrom && new Date(coupon.validFrom) > now) throw new Error('This coupon is not yet valid.');
  if (coupon.validUntil && new Date(coupon.validUntil) < now) throw new Error('This coupon has expired.');

  if (coupon.usageLimit !== null && (coupon.usedCount ?? 0) >= coupon.usageLimit) {
    throw new Error('This coupon has reached its usage limit.');
  }

  if (coupon.minOrderValue && orderValue < Number(coupon.minOrderValue)) {
    throw new Error(`Minimum order value of ₹${Number(coupon.minOrderValue).toLocaleString('en-IN')} required.`);
  }

  // Per-user limit check
  if (userId && coupon.perUserLimit) {
    const [userUsage] = await db
      .select({ count: sql<number>`count(*)` })
      .from(orders)
      .where(and(eq(orders.couponId, coupon.id), eq(orders.userId, userId)));
    if (Number(userUsage?.count ?? 0) >= coupon.perUserLimit) {
      throw new Error('You have already used this coupon.');
    }
  }

  return coupon;
}

/**
 * Calculate the actual discount amount for a given coupon and order value
 */
export function calculateDiscount(coupon: { discountType: string; discountValue: string; maxDiscountAmount: string | null }, orderValue: number): number {
  const value = Number(coupon.discountValue);
  if (coupon.discountType === 'flat') {
    return Math.min(value, orderValue);
  }
  // percentage
  const raw = (orderValue * value) / 100;
  const max = coupon.maxDiscountAmount ? Number(coupon.maxDiscountAmount) : Infinity;
  return Math.min(raw, max);
}

/**
 * Increment the usedCount on a coupon (called after a successful order)
 */
export async function incrementCouponUsage(couponId: number) {
  await db
    .update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1`, updatedAt: new Date() })
    .where(eq(coupons.id, couponId));
}

/**
 * Create a new coupon
 */
export async function createCoupon(data: {
  code: string;
  description?: string;
  discountType: string;
  discountValue: string;
  maxDiscountAmount?: string | null;
  minOrderValue?: string | null;
  usageLimit?: number | null;
  perUserLimit?: number;
  validFrom?: Date;
  validUntil?: Date | null;
  isActive?: boolean;
}) {
  const [coupon] = await db
    .insert(coupons)
    .values({
      code: data.code.toUpperCase(),
      description: data.description,
      discountType: data.discountType,
      discountValue: data.discountValue,
      maxDiscountAmount: data.maxDiscountAmount ?? null,
      minOrderValue: data.minOrderValue ?? null,
      usageLimit: data.usageLimit ?? null,
      perUserLimit: data.perUserLimit ?? 1,
      validFrom: data.validFrom,
      validUntil: data.validUntil ?? null,
      isActive: data.isActive ?? true,
    })
    .returning();
  return coupon;
}

/**
 * Update a coupon
 */
export async function updateCoupon(id: number, data: Partial<{
  code: string;
  description: string;
  discountType: string;
  discountValue: string;
  maxDiscountAmount: string | null;
  minOrderValue: string | null;
  usageLimit: number | null;
  perUserLimit: number;
  validFrom: Date;
  validUntil: Date | null;
  isActive: boolean;
}>) {
  const [updated] = await db
    .update(coupons)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(coupons.id, id))
    .returning();
  return updated;
}

/**
 * Delete a coupon
 */
export async function deleteCoupon(id: number) {
  const [deleted] = await db
    .delete(coupons)
    .where(eq(coupons.id, id))
    .returning();
  return deleted;
}
