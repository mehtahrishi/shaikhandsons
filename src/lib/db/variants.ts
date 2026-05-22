import { db } from './index';
import { vehicleVariants, globalVariants } from './schema';
import { eq, and, asc } from 'drizzle-orm';

/**
 * Get all available variants for a vehicle, ordered by sortOrder then price
 */
export async function getVariantsByVehicleId(vehicleId: number) {
  return db
    .select({
      id: vehicleVariants.id,
      vehicleId: vehicleVariants.vehicleId,
      globalVariantId: vehicleVariants.globalVariantId,
      price: globalVariants.price,
      isDefault: vehicleVariants.isDefault,
      isAvailable: vehicleVariants.isAvailable,
      sortOrder: vehicleVariants.sortOrder,
      createdAt: vehicleVariants.createdAt,
      updatedAt: vehicleVariants.updatedAt,
      name: globalVariants.name,
      variantType: globalVariants.variantType,
      chargingTime: globalVariants.chargingTime,
    })
    .from(vehicleVariants)
    .innerJoin(globalVariants, eq(vehicleVariants.globalVariantId, globalVariants.id))
    .where(and(eq(vehicleVariants.vehicleId, vehicleId), eq(vehicleVariants.isAvailable, true)))
    .orderBy(asc(vehicleVariants.sortOrder), asc(globalVariants.price));
}

/**
 * Get all variants (including unavailable) — for admin panel
 */
export async function getAllVariantsByVehicleId(vehicleId: number) {
  return db
    .select({
      id: vehicleVariants.id,
      vehicleId: vehicleVariants.vehicleId,
      globalVariantId: vehicleVariants.globalVariantId,
      price: globalVariants.price,
      isDefault: vehicleVariants.isDefault,
      isAvailable: vehicleVariants.isAvailable,
      sortOrder: vehicleVariants.sortOrder,
      createdAt: vehicleVariants.createdAt,
      updatedAt: vehicleVariants.updatedAt,
      name: globalVariants.name,
      variantType: globalVariants.variantType,
      chargingTime: globalVariants.chargingTime,
    })
    .from(vehicleVariants)
    .innerJoin(globalVariants, eq(vehicleVariants.globalVariantId, globalVariants.id))
    .where(eq(vehicleVariants.vehicleId, vehicleId))
    .orderBy(asc(vehicleVariants.sortOrder));
}

/**
 * Get a single variant by ID
 */
export async function getVariantById(id: number) {
  const results = await db
    .select({
      id: vehicleVariants.id,
      vehicleId: vehicleVariants.vehicleId,
      globalVariantId: vehicleVariants.globalVariantId,
      price: globalVariants.price,
      isDefault: vehicleVariants.isDefault,
      isAvailable: vehicleVariants.isAvailable,
      sortOrder: vehicleVariants.sortOrder,
      createdAt: vehicleVariants.createdAt,
      updatedAt: vehicleVariants.updatedAt,
      name: globalVariants.name,
      variantType: globalVariants.variantType,
      chargingTime: globalVariants.chargingTime,
    })
    .from(vehicleVariants)
    .innerJoin(globalVariants, eq(vehicleVariants.globalVariantId, globalVariants.id))
    .where(eq(vehicleVariants.id, id));
  return results[0] ?? null;
}

/**
 * Create a new variant. If isDefault is true, unset any existing default first.
 * Finds or creates the global variant by name automatically.
 */
export async function createVariant(data: {
  vehicleId: number;
  name: string;
  variantType?: string;
  price: string;
  chargingTime?: string;
  isDefault?: boolean;
  isAvailable?: boolean;
  sortOrder?: number;
  globalVariantId?: number; // Optional: directly associate if chosen from dropdown
}) {
  if (data.isDefault) {
    await db
      .update(vehicleVariants)
      .set({ isDefault: false })
      .where(eq(vehicleVariants.vehicleId, data.vehicleId));
  }

  let finalGlobalVariantId = data.globalVariantId;

  if (!finalGlobalVariantId) {
    // Find or create global variant by name
    let globalVar = await db.query.globalVariants.findFirst({
      where: eq(globalVariants.name, data.name),
    });

    if (!globalVar) {
      const [inserted] = await db
        .insert(globalVariants)
        .values({
          name: data.name,
          variantType: data.variantType ?? 'battery',
          price: data.price,
          chargingTime: data.chargingTime,
        })
        .returning();
      globalVar = inserted;
    } else {
      // Keep global variant specs updated
      const updates: any = {};
      if (data.variantType !== undefined && data.variantType !== globalVar.variantType) updates.variantType = data.variantType;
      if (data.chargingTime !== undefined && data.chargingTime !== globalVar.chargingTime) updates.chargingTime = data.chargingTime;
      if (data.price !== undefined && Number(data.price) !== Number(globalVar.price)) updates.price = data.price;
      
      if (Object.keys(updates).length > 0) {
        await db
          .update(globalVariants)
          .set(updates)
          .where(eq(globalVariants.id, globalVar.id));
      }
    }
    finalGlobalVariantId = globalVar.id;
  }

  const [variant] = await db
    .insert(vehicleVariants)
    .values({
      vehicleId: data.vehicleId,
      globalVariantId: finalGlobalVariantId,
      isDefault: data.isDefault ?? false,
      isAvailable: data.isAvailable ?? true,
      sortOrder: data.sortOrder ?? 0,
    })
    .returning();

  return getVariantById(variant.id);
}

/**
 * Update a variant by ID
 */
export async function updateVariant(id: number, data: Partial<{
  name: string;
  variantType: string;
  price: string;
  chargingTime: string;
  isDefault: boolean;
  isAvailable: boolean;
  sortOrder: number;
}>) {
  // If setting as default, unset others for the same vehicle first
  if (data.isDefault === true) {
    const current = await getVariantById(id);
    if (current) {
      await db
        .update(vehicleVariants)
        .set({ isDefault: false })
        .where(eq(vehicleVariants.vehicleId, current.vehicleId));
    }
  }

  // Get the current mapping
  const currentMapping = await db.query.vehicleVariants.findFirst({
    where: eq(vehicleVariants.id, id),
  });
  if (!currentMapping) throw new Error('Variant mapping not found');

  // Update global variant details if present
  const globalUpdates: any = {};
  if (data.name !== undefined) globalUpdates.name = data.name;
  if (data.variantType !== undefined) globalUpdates.variantType = data.variantType;
  if (data.price !== undefined) globalUpdates.price = data.price;
  if (data.chargingTime !== undefined) globalUpdates.chargingTime = data.chargingTime;

  if (Object.keys(globalUpdates).length > 0) {
    await db
      .update(globalVariants)
      .set(globalUpdates)
      .where(eq(globalVariants.id, currentMapping.globalVariantId));
  }

  // Update mapping fields
  const mappingUpdates: any = {};
  if (data.isDefault !== undefined) mappingUpdates.isDefault = data.isDefault;
  if (data.isAvailable !== undefined) mappingUpdates.isAvailable = data.isAvailable;
  if (data.sortOrder !== undefined) mappingUpdates.sortOrder = data.sortOrder;

  if (Object.keys(mappingUpdates).length > 0) {
    await db
      .update(vehicleVariants)
      .set({ ...mappingUpdates, updatedAt: new Date() })
      .where(eq(vehicleVariants.id, id));
  }

  return getVariantById(id);
}

/**
 * Delete a variant mapping by ID
 */
export async function deleteVariant(id: number) {
  const [deleted] = await db
    .delete(vehicleVariants)
    .where(eq(vehicleVariants.id, id))
    .returning();
  return deleted;
}

/**
 * Get all global variants
 */
export async function getAllGlobalVariants() {
  return db
    .select()
    .from(globalVariants)
    .orderBy(asc(globalVariants.name));
}

/**
 * Create a global variant preset
 */
export async function createGlobalVariant(data: {
  name: string;
  variantType: string;
  price?: number | string | null;
  chargingTime?: string | null;
}) {
  const [inserted] = await db
    .insert(globalVariants)
    .values({
      name: data.name,
      variantType: data.variantType,
      price: data.price?.toString() ?? '0.00',
      chargingTime: data.chargingTime,
    })
    .returning();
  return inserted;
}

/**
 * Update a global variant preset
 */
export async function updateGlobalVariant(id: number, data: Partial<{
  name: string;
  variantType: string;
  price: number | string | null;
  chargingTime: string | null;
}>) {
  const updates: any = { ...data };
  if (data.price !== undefined) {
    updates.price = data.price?.toString() ?? '0.00';
  }
  const [updated] = await db
    .update(globalVariants)
    .set(updates)
    .where(eq(globalVariants.id, id))
    .returning();
  return updated;
}

/**
 * Delete a global variant preset
 */
export async function deleteGlobalVariant(id: number) {
  const [deleted] = await db
    .delete(globalVariants)
    .where(eq(globalVariants.id, id))
    .returning();
  return deleted;
}
