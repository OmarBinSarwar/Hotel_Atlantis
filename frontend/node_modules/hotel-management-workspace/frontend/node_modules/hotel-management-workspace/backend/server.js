import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './lib/db.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS for all requests (matches previous Next.js behavior)
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// 1. GET /api/rooms — Fetch and filter rooms
app.get('/api/rooms', async (req, res) => {
  try {
    const type = req.query.type;
    const guests = req.query.guests;

    const where = {};
    if (type && type !== 'all') where.type = type;
    if (guests) where.maxGuests = { gte: parseInt(guests) };

    const rooms = await prisma.room.findMany({
      where,
      orderBy: { price: 'asc' },
    });

    // Parse amenities from JSON string to array
    const parsed = rooms.map((r) => ({
      ...r,
      amenities: JSON.parse(r.amenities),
    }));

    return res.json({ success: true, data: parsed });
  } catch (error) {
    console.error('[GET /api/rooms]', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch rooms' });
  }
});

// 2. GET /api/rooms/:id — Fetch a single room by ID
app.get('/api/rooms/:id', async (req, res) => {
  try {
    const room = await prisma.room.findUnique({
      where: { id: req.params.id },
    });

    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    return res.json({
      success: true,
      data: { ...room, amenities: JSON.parse(room.amenities) },
    });
  } catch (error) {
    console.error('[GET /api/rooms/:id]', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch room' });
  }
});

// 3. GET /api/bookings — Fetch bookings, optionally filtered by reference (?ref=...)
app.get('/api/bookings', async (req, res) => {
  try {
    const ref = req.query.ref;

    if (ref) {
      const booking = await prisma.booking.findUnique({
        where: { reference: ref },
        include: { room: true },
      });

      if (!booking) {
        return res.status(404).json({ success: false, error: 'Booking not found' });
      }

      return res.json({
        success: true,
        data: {
          ...booking,
          room: { ...booking.room, amenities: JSON.parse(booking.room.amenities) }
        },
      });
    }

    const bookings = await prisma.booking.findMany({
      include: { room: true },
      orderBy: { createdAt: 'desc' },
    });

    return res.json({ success: true, data: bookings });
  } catch (error) {
    console.error('[GET /api/bookings]', error);
    return res.status(500).json({ success: false, error: 'Failed to fetch bookings' });
  }
});

// 4. POST /api/bookings — Create a new booking
app.post('/api/bookings', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut, guests, guestName, guestEmail, guestPhone, specialReq } = req.body;

    // Validate required fields
    if (!roomId || !checkIn || !checkOut || !guests || !guestName || !guestEmail) {
      return res.status(400).json({ success: false, error: 'All fields are required' });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ success: false, error: 'Check-out must be after check-in' });
    }

    // Check room exists
    const room = await prisma.room.findUnique({ where: { id: roomId } });
    if (!room) {
      return res.status(404).json({ success: false, error: 'Room not found' });
    }

    // Check availability (non-cancelled overlapping bookings)
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
      return res.status(409).json({ success: false, error: 'Room is not available for selected dates' });
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

    return res.status(201).json({
      success: true,
      data: {
        ...booking,
        room: { ...booking.room, amenities: JSON.parse(booking.room.amenities) },
      },
    });
  } catch (error) {
    console.error('[POST /api/bookings]', error);
    return res.status(500).json({ success: false, error: 'Failed to create booking' });
  }
});

// 5. POST /api/availability — Check if a room is available for given dates
app.post('/api/availability', async (req, res) => {
  try {
    const { roomId, checkIn, checkOut } = req.body;

    if (!roomId || !checkIn || !checkOut) {
      return res.status(400).json({ success: false, error: 'roomId, checkIn, checkOut are required' });
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

    return res.json({ success: true, available });
  } catch (error) {
    console.error('[POST /api/availability]', error);
    return res.status(500).json({ success: false, error: 'Availability check failed' });
  }
});

// Health check / index route
app.get('/', (req, res) => {
  res.send('Hotel Atlantis Royal API (Express) is running...');
});

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
