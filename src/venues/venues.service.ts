import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, VenueStatus } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Injectable()
export class VenuesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(search?: string) {
    const venues = await this.prisma.venue.findMany({
      where: search
        ? {
            OR: [
              { name: { contains: search, mode: 'insensitive' } },
              { location: { contains: search, mode: 'insensitive' } },
              {
                status: Object.values(VenueStatus).includes(
                  search as VenueStatus,
                )
                  ? (search as VenueStatus)
                  : undefined,
              },
            ],
          }
        : undefined,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { bookings: true },
        },
        bookings: {
          where: {
            bookingStatus: {
              in: [BookingStatus.pending, BookingStatus.confirmed],
            },
          },
          select: { id: true },
        },
      },
    });

    return venues.map((venue) => {
      const { bookings, ...venueData } = venue;

      return {
        ...venueData,
        activeBookingCount: bookings.length,
      };
    });
  }

  async findOne(id: number) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
    });

    if (!venue) {
      throw new NotFoundException(`Venue dengan ID ${id} tidak ditemukan`);
    }

    return venue;
  }

  async findOneWithBookings(id: number) {
    const venue = await this.prisma.venue.findUnique({
      where: { id },
      include: {
        bookings: {
          orderBy: [
            {
              startDate: 'asc',
            },
            {
              endDate: 'asc',
            },
            {
              startTime: 'asc',
            },
          ],
        },
      },
    });

    if (!venue) {
      throw new NotFoundException(`Venue dengan ID ${id} tidak ditemukan`);
    }

    return venue;
  }

  async create(dto: CreateVenueDto) {
    return this.prisma.venue.create({
      data: {
        name: dto.name,
        location: dto.location,
        capacity: dto.capacity,
        facilities: dto.facilities ?? null,
        pricePerDay: dto.price_per_day,
        status: dto.status,
        description: dto.description ?? null,
      },
    });
  }

  async update(id: number, dto: UpdateVenueDto) {
    // Pastikan venue ada dulu sebelum update
    // Kalau tidak ada, findOne() sudah throw NotFoundException
    await this.findOne(id);

    return this.prisma.venue.update({
      where: { id },
      data: {
        // Hanya update field yang dikirim (tidak undefined)
        ...(dto.name !== undefined && { name: dto.name }),
        ...(dto.location !== undefined && { location: dto.location }),
        ...(dto.capacity !== undefined && { capacity: dto.capacity }),
        ...(dto.facilities !== undefined && { facilities: dto.facilities }),
        ...(dto.price_per_day !== undefined && {
          pricePerDay: dto.price_per_day,
        }),
        ...(dto.status !== undefined && { status: dto.status }),
        ...(dto.description !== undefined && {
          description: dto.description,
        }),
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    // Cek apakah venue masih punya booking aktif (pending/confirmed)
    const activeBookingCount = await this.prisma.eventBooking.count({
      where: {
        venueId: id,
        bookingStatus: {
          in: [BookingStatus.pending, BookingStatus.confirmed],
        },
      },
    });

    if (activeBookingCount > 0) {
      throw new BadRequestException(
        `Venue tidak dapat dihapus karena masih memiliki ${activeBookingCount} booking aktif`,
      );
    }

    // Hapus semua booking yang sudah cancelled terlebih dahulu
    // agar tidak terkena constraint onDelete: Restrict di database
    await this.prisma.eventBooking.deleteMany({
      where: {
        venueId: id,
        bookingStatus: BookingStatus.cancelled,
      },
    });

    await this.prisma.venue.delete({ where: { id } });
    return { message: 'Venue berhasil dihapus' };
  }
}
