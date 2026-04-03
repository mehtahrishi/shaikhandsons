import { db } from './index';
import { users, vehicles, brands } from './schema';
import { sql } from 'drizzle-orm';

/**
 * Get aggregated statistics for the admin dashboard
 */
export async function getDashboardStats() {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [vehicleCount] = await db.select({ count: sql<number>`count(*)` }).from(vehicles);
  const [brandCount] = await db.select({ count: sql<number>`count(*)` }).from(brands);
  
  const [totalValue] = await db.select({ 
    sum: sql<number>`COALESCE(sum(price), 0)` 
  }).from(vehicles);

  // Get some recent vehicles for a "Recently Added" feel if needed later
  const recentVehicles = await db.query.vehicles.findMany({
    limit: 5,
    orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)]
  });

  return {
    totalUsers: Number(userCount?.count || 0),
    totalVehicles: Number(vehicleCount?.count || 0),
    totalBrands: Number(brandCount?.count || 0),
    totalAssetValue: Number(totalValue?.sum || 0),
    recentVehicles
  };
}
