import 'dotenv/config';
import {
  PrismaClient,
  VenueStatus,
  BookingStatus,
  PaymentStatus,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not defined');
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

function date(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month - 1, day));
}

function time(hour: number, minute: number): Date {
  return new Date(Date.UTC(1970, 0, 1, hour, minute, 0, 0));
}

async function main() {
  console.log('Seeding database...\n');

  await prisma.eventBooking.deleteMany();
  await prisma.venue.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing records.');

  const saltRounds = 10;

  const [admin, staff, operator] = await Promise.all([
    prisma.user.create({
      data: {
        name: 'Administrator',
        email: 'admin@smartvenue.id',
        password: await bcrypt.hash('Admin@1234', saltRounds),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Budi Santoso',
        email: 'budi@smartvenue.id',
        password: await bcrypt.hash('Staff@1234', saltRounds),
      },
    }),
    prisma.user.create({
      data: {
        name: 'Siti Rahayu',
        email: 'siti@smartvenue.id',
        password: await bcrypt.hash('Operator@1234', saltRounds),
      },
    }),
  ]);

  console.log(
    `Users created: ${[admin, staff, operator].map((u) => u.email).join(', ')}`,
  );

  const venueData = [
    {
      name: 'Grand Ballroom Nusantara',
      location: 'Jl. Sudirman No. 1, Jakarta Pusat',
      capacity: 1000,
      facilities:
        'AC sentral, sound system profesional, layar LED 4K, parkir 300 kendaraan, catering tersedia',
      pricePerDay: 25_000_000,
      status: VenueStatus.available,
      description:
        'Ballroom mewah dengan interior klasik modern, cocok untuk gala dinner, pernikahan, dan konferensi skala besar.',
    },
    {
      name: 'Aula Serbaguna Pancasila',
      location: 'Jl. Gatot Subroto KM 3, Bandung',
      capacity: 500,
      facilities:
        'Proyektor HD, podium, kursi lipat, toilet VIP, genset cadangan',
      pricePerDay: 12_000_000,
      status: VenueStatus.available,
      description:
        'Aula serbaguna yang fleksibel untuk seminar, workshop, acara kelulusan, dan pameran produk.',
    },
    {
      name: 'Convention Hall Prambanan',
      location: 'Jl. Raya Prambanan No. 45, Sleman, Yogyakarta',
      capacity: 800,
      facilities:
        'Ruang breakout 4 unit, WiFi 1 Gbps, dapur katering, stage portabel, backstage artist',
      pricePerDay: 18_500_000,
      status: VenueStatus.available,
      description:
        'Venue prestisius dekat Candi Prambanan, ideal untuk konvensi nasional, pameran seni, dan launching produk.',
    },
    {
      name: 'Ruang Rapat Diponegoro',
      location: 'Gedung Perkantoran Thamrin, Lt. 12, Jakarta Pusat',
      capacity: 80,
      facilities:
        'Smart TV 85", video conference Zoom/Teams, whiteboard interaktif, pantry, sekretaris on-call',
      pricePerDay: 4_500_000,
      status: VenueStatus.available,
      description:
        'Ruang rapat eksekutif untuk meeting direksi, presentasi klien, dan sesi pelatihan kelas kecil.',
    },
    {
      name: 'Taman Budaya Cendrawasih',
      location: 'Jl. Cendrawasih No. 22, Makassar',
      capacity: 1200,
      facilities:
        'Open stage outdoor, tribun penonton, tata lampu artistik, ticketing booth, area food vendor',
      pricePerDay: 20_000_000,
      status: VenueStatus.available,
      description:
        'Venue outdoor ikonik dengan nuansa budaya lokal, sempurna untuk festival musik, pameran UMKM, dan event komunitas.',
    },
    {
      name: 'Studio Rekaman Harmoni',
      location: 'Jl. Melawai Raya No. 8, Jakarta Selatan',
      capacity: 30,
      facilities:
        'Studio recording profesional, mixing console 64-channel, bilik vocal, ruang tunggu artis',
      pricePerDay: 8_000_000,
      status: VenueStatus.maintenance,
      description:
        'Studio rekaman berstandar internasional, sedang dalam upgrade peralatan mixing terbaru.',
    },
    {
      name: 'Gedung Pertemuan Hayam Wuruk',
      location: 'Jl. Hayam Wuruk No. 101, Surabaya',
      capacity: 350,
      facilities:
        'Kursi teater, AC split, podium, backdrop custom, area registrasi',
      pricePerDay: 9_000_000,
      status: VenueStatus.inactive,
      description:
        'Gedung pertemuan yang sedang tidak aktif beroperasi untuk keperluan renovasi eksterior.',
    },
  ];

  const venues = await Promise.all(
    venueData.map((v) => prisma.venue.create({ data: v })),
  );

  console.log(`Venues created: ${venues.length} venues.`);

  const bookings = [
    {
      venueId: venues[0].id,
      eventName: 'Gala Dinner Annual PT Maju Bersama',
      organizerName: 'Dewi Kusuma',
      startDate: date(2026, 7, 5),
      endDate: date(2026, 7, 5),
      startTime: time(18, 0),
      endTime: time(23, 0),
      attendees: 850,
      bookingStatus: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.paid,
      notes: 'Meja VIP sudah dikonfirmasi. Katering dari Nusantara Catering.',
    },
    // --- Confirmed + Paid ---
    {
      venueId: venues[2].id, // Convention Hall Prambanan
      eventName: 'Konvensi Teknologi Indonesia 2026',
      organizerName: 'Rizky Firmansyah',
      startDate: date(2026, 8, 14),
      endDate: date(2026, 8, 14),
      startTime: time(8, 0),
      endTime: time(17, 0),
      attendees: 700,
      bookingStatus: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.paid,
      notes: 'Speaker dari 3 negara. Butuh lounge khusus VIP.',
    },
    // --- Confirmed + Unpaid ---
    {
      venueId: venues[1].id, // Aula Serbaguna Pancasila
      eventName: 'Seminar Nasional Pendidikan 4.0',
      organizerName: 'Dr. Andi Wijaya',
      startDate: date(2026, 7, 20),
      endDate: date(2026, 7, 20),
      startTime: time(9, 0),
      endTime: time(16, 0),
      attendees: 450,
      bookingStatus: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.unpaid,
      notes: 'Invoice sudah dikirim, menunggu transfer dari panitia.',
    },
    // --- Pending + Unpaid ---
    {
      venueId: venues[3].id, // Ruang Rapat Diponegoro
      eventName: 'Rapat Direksi Kuartal III',
      organizerName: 'Maya Hartini',
      startDate: date(2026, 7, 10),
      endDate: date(2026, 7, 10),
      startTime: time(10, 0),
      endTime: time(13, 0),
      attendees: 20,
      bookingStatus: BookingStatus.pending,
      paymentStatus: PaymentStatus.unpaid,
      notes: 'Menunggu persetujuan GM.',
    },
    // --- Pending + Unpaid ---
    {
      venueId: venues[4].id, // Taman Budaya Cendrawasih
      eventName: 'Festival Kuliner Nusantara 2026',
      organizerName: 'Komunitas Kuliner Makassar',
      startDate: date(2026, 9, 1),
      endDate: date(2026, 9, 1),
      startTime: time(10, 0),
      endTime: time(22, 0),
      attendees: 1100,
      bookingStatus: BookingStatus.pending,
      paymentStatus: PaymentStatus.unpaid,
      notes: 'Izin keramaian sedang diurus ke Pemkot.',
    },
    // --- Pending + Unpaid ---
    {
      venueId: venues[0].id, // Grand Ballroom Nusantara
      eventName: 'Pernikahan Adit & Laras',
      organizerName: 'Keluarga Suryana',
      startDate: date(2026, 10, 18),
      endDate: date(2026, 10, 18),
      startTime: time(9, 0),
      endTime: time(22, 0),
      attendees: 950,
      bookingStatus: BookingStatus.pending,
      paymentStatus: PaymentStatus.unpaid,
      notes: 'Request dekorasi tema Bali modern.',
    },
    // --- Cancelled + Refunded ---
    {
      venueId: venues[1].id, // Aula Serbaguna Pancasila
      eventName: 'Workshop Digital Marketing',
      organizerName: 'Startup Hub Bandung',
      startDate: date(2026, 6, 10),
      endDate: date(2026, 6, 10),
      startTime: time(9, 0),
      endTime: time(15, 0),
      attendees: 120,
      bookingStatus: BookingStatus.cancelled,
      paymentStatus: PaymentStatus.refunded,
      notes: 'Dibatalkan karena pembicara utama tidak bisa hadir.',
    },
    // --- Cancelled + Unpaid ---
    {
      venueId: venues[3].id, // Ruang Rapat Diponegoro
      eventName: 'Pelatihan K3 Internal',
      organizerName: 'HRD PT Bangun Karya',
      startDate: date(2026, 6, 5),
      endDate: date(2026, 6, 5),
      startTime: time(13, 0),
      endTime: time(17, 0),
      attendees: 35,
      bookingStatus: BookingStatus.cancelled,
      paymentStatus: PaymentStatus.unpaid,
      notes: 'Dibatalkan karena peserta tidak mencukupi kuorum.',
    },
    // --- Confirmed + Paid (sudah lewat — historical data) ---
    {
      venueId: venues[4].id, // Taman Budaya Cendrawasih
      eventName: 'Konser Musik Independen Makassar',
      organizerName: 'Yayasan Seni Sulawesi',
      startDate: date(2026, 5, 25),
      endDate: date(2026, 5, 25),
      startTime: time(17, 0),
      endTime: time(23, 0),
      attendees: 1000,
      bookingStatus: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.paid,
      notes: 'Sudah berlangsung sukses. 12 band tampil.',
    },
    // --- Confirmed + Paid (historical) ---
    {
      venueId: venues[2].id, // Convention Hall Prambanan
      eventName: 'Pameran Kerajinan Tangan Jogja Craft 2026',
      organizerName: 'Dinas Perindustrian DIY',
      startDate: date(2026, 4, 15),
      endDate: date(2026, 4, 15),
      startTime: time(8, 0),
      endTime: time(20, 0),
      attendees: 600,
      bookingStatus: BookingStatus.confirmed,
      paymentStatus: PaymentStatus.paid,
      notes: '300 booth pengrajin lokal. Dibuka oleh Gubernur.',
    },
  ];

  await prisma.eventBooking.createMany({ data: bookings });
  console.log(`Event bookings created: ${bookings.length} bookings.`);

  const [userCount, venueCount, bookingCount] = await Promise.all([
    prisma.user.count(),
    prisma.venue.count(),
    prisma.eventBooking.count(),
  ]);

  console.log('\n─────────────────────────────');
  console.log('Seed summary:');
  console.log(`    Users    : ${userCount}`);
  console.log(`    Venues   : ${venueCount}`);
  console.log(`    Bookings : ${bookingCount}`);
  console.log('─────────────────────────────');
  console.log('\n  Seeding complete!\n');
  console.log('Default accounts:');
  console.log('  admin@smartvenue.id   → Admin@1234');
  console.log('  budi@smartvenue.id    → Staff@1234');
  console.log('  siti@smartvenue.id    → Operator@1234\n');
}

main()
  .catch((e) => {
    console.error('  Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
