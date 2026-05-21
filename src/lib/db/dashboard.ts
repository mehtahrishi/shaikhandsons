import { db } from './index';
import { users, vehicles, brands, likes } from './schema';
import { sql, desc, eq } from 'drizzle-orm';

/**
 * Get aggregated statistics for the admin dashboard
 */
export async function getDashboardStats() {
  const [userCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
  const [vehicleCount] = await db.select({ count: sql<number>`count(*)` }).from(vehicles);
  const [brandCount] = await db.select({ count: sql<number>`count(*)` }).from(brands);
  const [likeCount] = await db.select({ count: sql<number>`count(*)` }).from(likes);
  
  const [totalValue] = await db.select({ 
    sum: sql<number>`COALESCE(sum(price), 0)` 
  }).from(vehicles);

  // Get top 10 most liked vehicles
  const popularVehicles = await db
    .select({
      id: vehicles.id,
      make: vehicles.make,
      model: vehicles.model,
      slug: vehicles.slug,
      likeCount: sql<number>`count(${likes.id})`.as('likes')
    })
    .from(vehicles)
    .innerJoin(likes, eq(vehicles.id, likes.vehicleId))
    .groupBy(vehicles.id)
    .orderBy(desc(sql`likes`))
    .limit(10);

  // Get all individual like interactions (Who liked what)
  const allLikesDetail = await db
    .select({
      id: likes.id,
      userName: users.fullName,
      userEmail: users.email,
      vehicleMake: vehicles.make,
      vehicleModel: vehicles.model,
      createdAt: likes.createdAt
    })
    .from(likes)
    .innerJoin(users, eq(likes.userId, users.id))
    .innerJoin(vehicles, eq(likes.vehicleId, vehicles.id))
    .orderBy(desc(likes.createdAt))
    .limit(50); // Show last 50 for the dashboard list

  // Get some recent vehicles
  const recentVehicles = await db.query.vehicles.findMany({
    limit: 5,
    orderBy: (vehicles, { desc }) => [desc(vehicles.createdAt)]
  });

  return {
    totalUsers: Number(userCount?.count || 0),
    totalVehicles: Number(vehicleCount?.count || 0),
    totalBrands: Number(brandCount?.count || 0),
    totalLikes: Number(likeCount?.count || 0),
    totalAssetValue: Number(totalValue?.sum || 0),
    popularVehicles,
    allLikesDetail,
    recentVehicles
  };
}
