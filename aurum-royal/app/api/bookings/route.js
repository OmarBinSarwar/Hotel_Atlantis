import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/bookings
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    if (ref) {
      const booking = await prisma.booking.findUnique({
        where: { reference: ref },
        include: { room: true },
      });

      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        data: { ...booking, room: { ...booking.room, amenities: JSON.parse(booking.room.amenities) } },
      });
    }

    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: bookings });
  } catch (error) {
    console.error('[GET /api/bookings]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST /api/bookings — create a new booking
export async function POST(request) {
  try {
    const body = await request.json();
    const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialReq } = body;

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return NextResponse.json(
        { success: false, error: 'Check-out must be after check-in' },
        { status: 400 }
      );
    }

    // Check room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return NextResponse.json(
        { success: false, error: 'Room not found' },
        { status: 404 }
      );
    }

    // Check availability
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

    if (conflicts.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Room is not available for selected dates' },
        { status: 409 }
      );
    }

    // Calculate total price
    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    const totalPrice = room.price * nights;

    // Generate reference
    const reference = 'AUR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase();

    const booking = await prisma.booking.create({
      data: {
        reference,
        roomId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests: parseInt(guests),
        guestName,
        guestEmail,
        guestPhone: guestPhone || '',
        specialReq: specialReq || '',
        totalPrice,
        status: 'confirmed',
      },
      include: { room: true },
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          ...booking,
          room: { ...booking.room, amenities: JSON.parse(booking.room.amenities) },
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('[POST /api/bookings]', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}
