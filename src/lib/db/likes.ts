import { db } from './index';
import { likes } from './schema';
import { eq, and, sql } from 'drizzle-orm';

/**
 * Get the total number of likes for a vehicle
 */
export async function getLikeCount(vehicleId: number) {
  try {
    const result = await db
      .select({ count: sql<number>`count(*)` })
      .from(likes)
      .where(eq(likes.vehicleId, vehicleId));
    return Number(result[0]?.count || 0);
  } catch (error) {
    console.error('Error getting like count:', error);
    return 0;
  }
}

/**
 * Check if a specific user has liked a vehicle
 */
export async function hasUserLiked(vehicleId: number, userId: number) {
  try {
    const result = await db
      .select()
      .from(likes)
      .where(and(eq(likes.vehicleId, vehicleId), eq(likes.userId, userId)));
    return result.length > 0;
  } catch (error) {
    console.error('Error checking user like:', error);
    return false;
  }
}

/**
 * Toggle a like for a vehicle by a user
 */
export async function toggleLike(vehicleId: number, userId: number) {
  try {
    const existing = await hasUserLiked(vehicleId, userId);
    if (existing) {
      await db
        .delete(likes)
        .where(and(eq(likes.vehicleId, vehicleId), eq(likes.userId, userId)));
      return { liked: false };
    } else {
      await db
        .insert(likes)
        .values({ vehicleId, userId });
      return { liked: true };
    }
  } catch (error) {
    console.error('Error toggling like:', error);
    throw new Error('Could not update like status');
  }
}
