import { db } from './index';
import { brands, vehicles } from './schema';
import { eq } from 'drizzle-orm';

/**
 * Get all brands
 */
export async function getAllBrands() {
  return db.query.brands.findMany();
}

/**
 * Get brand by ID
 */
export async function getBrandById(id: number) {
  return db.query.brands.findFirst({
    where: eq(brands.id, id),
  });
}

/**
 * Create brand
 */
export async function createBrand(name: string) {
  try {
    const result = await db
      .insert(brands)
      .values({
        name,
      })
      .returning();

    return result[0];
  } catch (error: any) {
    if (error.message?.includes('unique')) {
      throw new Error('Brand already exists');
    }
    throw error;
  }
}

/**
 * Update brand
 */
export async function updateBrand(id: number, name: string) {
  return await db.transaction(async (tx) => {
    // 1. Update the brand name
    const result = await tx
      .update(brands)
      .set({
        name,
        updatedAt: new Date(),
      })
      .where(eq(brands.id, id))
      .returning();

    // 2. Update all vehicles with this brandId to have the new make name
    if (result.length > 0) {
      await tx
        .update(vehicles)
        .set({
          make: name,
          updatedAt: new Date(),
        })
        .where(eq(vehicles.brandId, id));
    }

    return result[0];
  });
}

/**
 * Delete brand
 */
export async function deleteBrand(id: number) {
  return db.delete(brands).where(eq(brands.id, id));
}

/**
 * Get all vehicles
 */
export async function getAllVehicles() {
  return db.query.vehicles.findMany();
}

/**
 * Get vehicle by ID
 */
export async function getVehicleById(id: number) {
  return db.query.vehicles.findFirst({
    where: eq(vehicles.id, id),
  });
}

/**
 * Get vehicles by brand
 */
export async function getVehiclesByBrand(brandId: number) {
  return db.query.vehicles.findMany({
    where: eq(vehicles.brandId, brandId),
  });
}

/**
 * Create vehicle
 */
export async function createVehicle(data: {
  brandId: number;
  make: string;
  model: string;
  year: number;
  trim?: string | null;
  price: string;
  
  modelCode?: string | null;
  category?: string | null;
  shortDescription?: string | null;
  
  topSpeed?: string | null;
  certifiedRange?: string | null;
  realWorldRange?: string | null;
  ridingModes?: string[] | null;
  climbingDegree?: string | null;
  loadCapacity?: string | null;
  
  batteryType?: string | null;
  batteryCapacity?: string | null;
  chargingTime?: string | null;
  fastCharging?: boolean | null;
  chargerIncluded?: string | null;
  batteryWarranty?: string | null;
  
  motorPower?: string | null;
  brakingSystem?: string | null;
  tyreType?: string | null;
  wheelType?: string | null;
  wheelSize?: string | null;
  groundClearance?: string | null;
  
  displayType?: string | null;
  colors?: string[] | null;
  keyFeatures?: string[] | null;
  bootSpace?: string | null;

  batteryRangeKm?: number | null;
  horsepower?: number | null;
  zeroToSixtySeconds?: string | null;
  designPhilosophy?: string | null;
  imageUrls?: string[];
}) {
  const result = await db
    .insert(vehicles)
    .values({
      brandId: data.brandId,
      make: data.make,
      model: data.model,
      year: data.year,
      trim: data.trim || null,
      price: data.price,
      
      modelCode: data.modelCode || null,
      category: data.category || null,
      shortDescription: data.shortDescription || null,
      
      topSpeed: data.topSpeed || null,
      certifiedRange: data.certifiedRange || null,
      realWorldRange: data.realWorldRange || null,
      ridingModes: data.ridingModes || [],
      climbingDegree: data.climbingDegree || null,
      loadCapacity: data.loadCapacity || null,
      
      batteryType: data.batteryType || null,
      batteryCapacity: data.batteryCapacity || null,
      chargingTime: data.chargingTime || null,
      fastCharging: !!data.fastCharging,
      chargerIncluded: data.chargerIncluded || null,
      batteryWarranty: data.batteryWarranty || null,
      
      motorPower: data.motorPower || null,
      brakingSystem: data.brakingSystem || null,
      tyreType: data.tyreType || null,
      wheelType: data.wheelType || null,
      wheelSize: data.wheelSize || null,
      groundClearance: data.groundClearance || null,
      
      displayType: data.displayType || null,
      colors: data.colors || [],
      keyFeatures: data.keyFeatures || [],
      bootSpace: data.bootSpace || null,

      batteryRangeKm: data.batteryRangeKm || null,
      horsepower: data.horsepower || null,
      zeroToSixtySeconds: data.zeroToSixtySeconds || null,
      designPhilosophy: data.designPhilosophy || null,
      imageUrls: data.imageUrls || [],
    })
    .returning();

  return result[0];
}

/**
 * Update vehicle
 */
export async function updateVehicle(id: number, data: Partial<typeof vehicles.$inferInsert>) {
  const result = await db
    .update(vehicles)
    .set({
      ...data,
      updatedAt: new Date(),
    })
    .where(eq(vehicles.id, id))
    .returning();

  return result[0];
}

/**
 * Delete vehicle
 */
export async function deleteVehicle(id: number) {
  return db.delete(vehicles).where(eq(vehicles.id, id));
}
