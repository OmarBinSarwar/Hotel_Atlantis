import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/rooms/[id]
export async function GET(request, { params }) {
  try {
    const room = await prisma.room.findUnique({
      where: { id: params.id },
    });

    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...room, amenities: JSON.parse(room.amenities) },
    });
  } catch (error) {
    console.error('[GET /api/rooms/[id]]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch room' },
      { status: 500 }
    );
  }
}
