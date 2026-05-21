import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getVehicleBySlug, getVehicleById } from '@/lib/db/inventory';
import { getLikeCount, hasUserLiked, toggleLike } from '@/lib/db/likes';

export const runtime = 'nodejs';

/**
 * GET: Returns like count and whether the current user liked the vehicle
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;
    const session = await getSession();

    let vehicle = await getVehicleBySlug(identifier);
    if (!vehicle && /^\d+$/.test(identifier)) {
      vehicle = await getVehicleById(Number(identifier));
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const [likeCount, isLiked] = await Promise.all([
      getLikeCount(vehicle.id),
      session.userId ? hasUserLiked(vehicle.id, session.userId) : Promise.resolve(false),
    ]);

    return NextResponse.json({
      likeCount,
      isLiked,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch like status';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST: Toggles the like for the current user
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const identifier = resolvedParams.slug;
    const session = await getSession();

    if (!session.userId) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    let vehicle = await getVehicleBySlug(identifier);
    if (!vehicle && /^\d+$/.test(identifier)) {
      vehicle = await getVehicleById(Number(identifier));
    }

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    const result = await toggleLike(vehicle.id, session.userId);
    const newLikeCount = await getLikeCount(vehicle.id);

    return NextResponse.json({
      liked: result.liked,
      likeCount: newLikeCount,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to toggle like';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
