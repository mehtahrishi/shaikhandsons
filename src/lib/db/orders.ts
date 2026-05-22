import { db } from './index';
import { orders, vehicles, users, vehicleVariants } from './schema';
import { eq, desc, and, sql } from 'drizzle-orm';

/**
 * Create a new order
 */
export async function createOrder(data: {
  userId?: number | null;
  vehicleId: number;
  vehicleSlug: string;
  vehicleName: string;
  variantId?: number | null;
  variantName?: string | null;
  vehiclePrice: string;
  couponId?: number | null;
  couponCode?: string | null;
  discountAmount?: string;
  finalPrice?: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  preferredShowroom?: string;
  preferredDate?: string;
  orderType?: string;
}) {
  const [order] = await db
    .insert(orders)
    .values({
      userId: data.userId ?? null,
      vehicleId: data.vehicleId,
      vehicleSlug: data.vehicleSlug,
      vehicleName: data.vehicleName,
      variantId: data.variantId ?? null,
      variantName: data.variantName ?? null,
      vehiclePrice: data.vehiclePrice,
      couponId: data.couponId ?? null,
      couponCode: data.couponCode ?? null,
      discountAmount: data.discountAmount ?? '0',
      finalPrice: data.finalPrice ?? data.vehiclePrice,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: data.customerEmail,
      preferredShowroom: data.preferredShowroom,
      preferredDate: data.preferredDate,
      orderType: data.orderType ?? 'test_drive',
      status: 'pending',
    })
    .returning();

  return order;
}

/**
 * Get all orders with vehicle + user info — for admin panel
 */
export async function getAllOrders(statusFilter?: string) {
  const query = db
    .select({
      id: orders.id,
      customerName: orders.customerName,
      customerPhone: orders.customerPhone,
      customerEmail: orders.customerEmail,
      vehicleName: orders.vehicleName,
      vehicleSlug: orders.vehicleSlug,
      variantName: orders.variantName,
      vehiclePrice: orders.vehiclePrice,
      couponCode: orders.couponCode,
      discountAmount: orders.discountAmount,
      finalPrice: orders.finalPrice,
      preferredShowroom: orders.preferredShowroom,
      preferredDate: orders.preferredDate,
      orderType: orders.orderType,
      status: orders.status,
      adminNotes: orders.adminNotes,
      createdAt: orders.createdAt,
      updatedAt: orders.updatedAt,
      // Joined user info (null for guests)
      userId: orders.userId,
      userEmail: users.email,
      userFullName: users.fullName,
    })
    .from(orders)
    .leftJoin(users, eq(orders.userId, users.id))
    .orderBy(desc(orders.createdAt));

  if (statusFilter) {
    return query.where(eq(orders.status, statusFilter));
  }

  return query;
}

/**
 * Get a single order by ID
 */
export async function getOrderById(id: number) {
  const results = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id));
  return results[0] ?? null;
}

/**
 * Get all orders for a specific user
 */
export async function getOrdersByUserId(userId: number) {
  return db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));
}

/**
 * Update order status (and optional admin notes)
 */
export async function updateOrderStatus(id: number, status: string, adminNotes?: string) {
  const [updated] = await db
    .update(orders)
    .set({
      status,
      adminNotes: adminNotes ?? undefined,
      updatedAt: new Date(),
    })
    .where(eq(orders.id, id))
    .returning();
  return updated;
}

/**
 * Get order counts grouped by status — for dashboard
 */
export async function getOrderStats() {
  const [total] = await db.select({ count: sql<number>`count(*)` }).from(orders);
  const [pending] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'pending'));
  const [confirmed] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'confirmed'));
  const [completed] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'completed'));
  const [cancelled] = await db.select({ count: sql<number>`count(*)` }).from(orders).where(eq(orders.status, 'cancelled'));

  return {
    total: Number(total?.count ?? 0),
    pending: Number(pending?.count ?? 0),
    confirmed: Number(confirmed?.count ?? 0),
    completed: Number(completed?.count ?? 0),
    cancelled: Number(cancelled?.count ?? 0),
  };
}
