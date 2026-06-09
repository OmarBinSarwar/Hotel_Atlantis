import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/rooms — সব rooms fetch করো, optional filter: ?type=deluxe&guests=2
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const guests = searchParams.get('guests');

    const where = {};
    if (type && type !== 'all') where.type = type;
    if (guests) where.maxGuests = { gte: parseInt(guests) };

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    // Parse amenities JSON
    const parsed = rooms.map((r) => ({
      ...r,
      amenities: JSON.parse(r.amenities),
    }));

    return NextResponse.json({ success: true, data: parsed });
  } catch (error) {
    console.error('[GET /api/rooms]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch rooms' },
      { status: 500 }
    );
  }
}
