import { PrismaClient, VenueStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('admin123', 10);

  await prisma.user.upsert({
    where: {
      email: 'admin@venue.com',
    },
    update: {
      name: 'Admin Venue',
      password: hashedPassword,
    },
    create: {
      name: 'Admin Venue',
      email: 'admin@venue.com',
      password: hashedPassword,
    },
  });

  await prisma.eventBooking.deleteMany();
  await prisma.venue.deleteMany();

  await prisma.venue.createMany({
    data: [
      {
        name: 'Aula Utama',
        location: 'Gedung A Lt. 2',
        capacity: 300,
        facilities: 'AC, Proyektor, Sound System, Kursi, Panggung',
        pricePerDay: 5000000,
        status: VenueStatus.available,
        description:
          'Aula besar untuk seminar, wisuda kecil, pelatihan, dan acara komunitas.',
      },
      {
        name: 'Ruang Seminar B',
        location: 'Gedung B Lt. 1',
        capacity: 100,
        facilities: 'AC, Whiteboard, Proyektor, Meja Seminar',
        pricePerDay: 2000000,
        status: VenueStatus.available,
        description:
          'Ruang seminar berkapasitas sedang untuk workshop dan kelas pelatihan.',
      },
      {
        name: 'Ballroom Nusantara',
        location: 'Hotel Nusantara Lt. 3',
        capacity: 500,
        facilities: 'AC Central, LED Screen, Sound System, Lighting, Stage',
        pricePerDay: 12000000,
        status: VenueStatus.available,
        description:
          'Ballroom besar untuk konferensi, gathering perusahaan, dan acara formal.',
      },
      {
        name: 'Meeting Room Cendana',
        location: 'Co-working Space Cendana Lt. 2',
        capacity: 30,
        facilities: 'TV Display, Whiteboard, WiFi, Conference Speaker',
        pricePerDay: 750000,
        status: VenueStatus.maintenance,
        description:
          'Ruang meeting kecil untuk diskusi tim, sedang dalam proses maintenance.',
      },
      {
        name: 'Ruang Kelas Digital',
        location: 'Gedung C Lt. 4',
        capacity: 60,
        facilities: 'Smart TV, AC, WiFi, Kursi Kuliah, Stop Kontak',
        pricePerDay: 1250000,
        status: VenueStatus.inactive,
        description:
          'Ruang kelas digital yang sementara tidak aktif untuk penyewaan.',
      },
    ],
  });

  console.log('Database seeded successfully');
  console.log('Default admin: admin@venue.com / admin123');
}

main()
  .catch((error) => {
    console.error('Failed to seed database');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
