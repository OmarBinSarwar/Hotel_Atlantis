import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/availability — check if a room is available for given dates
export async function POST(request) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut } = body;

    if (!roomId || !checkIn || !checkOut) {
      return NextResponse.json(
        { success: false, error: 'roomId, checkIn, checkOut are required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    // Find conflicting bookings
    const conflicts = await prisma.booking.findMany({
      where: {
        roomId,
        status: { not: 'cancelled' },
        AND: [
          { checkIn: { lt: checkOutDate } },
          { checkOut: { gt: checkInDate } },
        ],
      },
    });

    const available = conflicts.length === 0;

    return NextResponse.json({ success: true, available });
  } catch (error) {
    console.error('[POST /api/availability]', error);
    return NextResponse.json(
      { success: false, error: 'Availability check failed' },
      { status: 500 }
    );
  }
}
