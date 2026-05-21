import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { db } from '@/lib/db';
import { likes, vehicles } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

/**
 * GET: Returns all vehicles liked by the current authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Fetch vehicles joined with likes for this user
    const favoriteVehicles = await db
      .select({
        id: vehicles.id,
        make: vehicles.make,
        model: vehicles.model,
        year: vehicles.year,
        trim: vehicles.trim,
        price: vehicles.price,
        slug: vehicles.slug,
        imageUrls: vehicles.imageUrls,
        certifiedRange: vehicles.certifiedRange,
        motorPower: vehicles.motorPower,
        topSpeed: vehicles.topSpeed,
        batteryRangeKm: vehicles.batteryRangeKm,
        horsepower: vehicles.horsepower,
        zeroToSixtySeconds: vehicles.zeroToSixtySeconds,
      })
      .from(likes)
      .innerJoin(vehicles, eq(likes.vehicleId, vehicles.id))
      .where(eq(likes.userId, session.userId))
      .orderBy(desc(likes.createdAt));

    return NextResponse.json({ favorites: favoriteVehicles });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch favorites';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
