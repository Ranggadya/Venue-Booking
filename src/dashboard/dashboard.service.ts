import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getStats() {
    const [
      totalVenues,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      availableVenues,
      maintenanceVenues,
      recentBookings,
    ] = await Promise.all([
      this.prisma.venue.count(),
      this.prisma.eventBooking.count(),
      this.prisma.eventBooking.count({ where: { bookingStatus: 'pending' } }),
      this.prisma.eventBooking.count({ where: { bookingStatus: 'confirmed' } }),
      this.prisma.eventBooking.count({ where: { bookingStatus: 'cancelled' } }),
      this.prisma.venue.count({ where: { status: 'available' } }),
      this.prisma.venue.count({ where: { status: 'maintenance' } }),
      this.prisma.eventBooking.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { venue: true },
      }),
    ]);

    return {
      totalVenues,
      totalBookings,
      pendingBookings,
      confirmedBookings,
      cancelledBookings,
      availableVenues,
      maintenanceVenues,
      recentBookings,
    };
  }
}
