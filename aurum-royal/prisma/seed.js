const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const rooms = [
  {
    id: '60c72b2f9b1d8e001f3c8f81',
    name: 'Deluxe Ocean Room',
    type: 'deluxe',
    price: 850,
    size: '52m²',
    bedType: 'King Bed',
    view: 'Ocean View',
    image: '/images/suite.png',
    maxGuests: 2,
    description: 'Panoramic gulf views, private balcony, marble bathroom suite with freestanding soaking tub.',
    amenities: JSON.stringify([
      'Private Balcony', 'King Bed', 'Marble Bathroom', 'Ocean View',
      'Butler Service', 'Complimentary Minibar', 'Nespresso Machine', '75" Smart TV',
      'Rain Shower', 'Pillow Menu', 'High-Speed WiFi', 'In-room Dining'
    ]),
  },
  {
    id: '60c72b2f9b1d8e001f3c8f82',
    name: 'Royal Ocean Suite',
    type: 'ocean',
    price: 2400,
    size: '180m²',
    bedType: '2 Bedrooms',
    view: 'Private Pool',
    image: '/images/suite.png',
    maxGuests: 4,
    description: 'Two-floor sanctuary with private plunge pool and dedicated butler service.',
    amenities: JSON.stringify([
      'Private Plunge Pool', 'Two Bedrooms', 'Separate Living Room', 'Gulf Panorama',
      'Dedicated Butler', 'Champagne on Arrival', 'Spa Bath', 'Private Terrace',
      'Dining for 4', 'Premium Minibar', '2x 85" Smart TVs', 'Bose Sound System'
    ]),
  },
  {
    id: '60c72b2f9b1d8e001f3c8f83',
    name: 'Sky Villa',
    type: 'villa',
    price: 5800,
    size: '380m²',
    bedType: '4 Bedrooms',
    view: 'Sky Terrace',
    image: '/images/suite.png',
    maxGuests: 8,
    description: 'The pinnacle of luxury — your private sky residence above the Gulf.',
    amenities: JSON.stringify([
      'Sky Terrace', 'Four Bedrooms', 'Private Infinity Pool', '360° Gulf Views',
      'Full Chef Kitchen', 'Private Gym', 'Home Cinema', 'Concierge Team',
      'Rolls-Royce Transfer', 'Private Dining', 'Spa Treatment Room', 'Wine Cellar'
    ]),
  },
  {
    id: '60c72b2f9b1d8e001f3c8f84',
    name: 'Royal Penthouse',
    type: 'royal',
    price: 12000,
    size: '800m²',
    bedType: 'Full Floor',
    view: '360° Views',
    image: '/images/suite.png',
    maxGuests: 10,
    description: 'The entire top floor — a private world of unrivalled grandeur and opulence.',
    amenities: JSON.stringify([
      'Entire Top Floor', 'Panoramic 360° Views', 'Indoor Pool', 'Private Helipad',
      'Private Chef', 'Multiple Butler Team', 'Grand Piano', 'Art Collection',
      'Private Cinema', 'Wine & Cigar Lounge', 'Corporate Boardroom', 'VIP Arrival'
    ]),
  },
  {
    id: '60c72b2f9b1d8e001f3c8f85',
    name: 'Sea Breeze Suite',
    type: 'deluxe',
    price: 1200,
    size: '95m²',
    bedType: 'King Bed',
    view: 'Sea View',
    image: '/images/suite.png',
    maxGuests: 2,
    description: 'A serene retreat with sweeping sea views and a luxurious spa-inspired bathroom.',
    amenities: JSON.stringify([
      'Sea View Terrace', 'King Bed', 'Spa Bathroom', 'Soaking Tub',
      'Nespresso Machine', 'Butler on Call', 'Welcome Fruit Basket', 'Smart TV',
      'Pillow Menu', 'Premium Toiletries', 'High-Speed WiFi', 'In-room Safe'
    ]),
  },
];

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.room.deleteMany();

  // Create rooms
  for (const room of rooms) {
    await prisma.room.create({ data: room });
    console.log(`✅ Created room: ${room.name}`);
  }

  console.log('✨ Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
