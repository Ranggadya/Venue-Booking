import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BookingStatus, PaymentStatus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { VenuesService } from 'src/venues/venues.service';
import { CreateEventBookingDto } from './dto/create-event-booking.dto';
import { UpdateEventBookingDto } from './dto/update-event-booking.dto';

type EventBookingWithVenue = Prisma.EventBookingGetPayload<{
  include: {
    venue: true;
  };
}>;

const toTimeDate = (timeStr: string): Date => {
  const [hours, minute] = timeStr.split(':').map(Number);
  const date = new Date(0);
  date.setUTCHours(hours, minute, 0, 0);
  return date;
};

const toDateOnly = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00.000Z');
};

const toDateTime = (dateStr: string, timeStr: string): Date => {
  const [hours, minute] = timeStr.split(':').map(Number);
  const date = toDateOnly(dateStr);
  date.setUTCHours(hours, minute, 0, 0);
  return date;
};

const combineDateAndTime = (date: Date, time: Date): Date => {
  const combined = new Date(date);
  combined.setUTCHours(time.getUTCHours(), time.getUTCMinutes(), 0, 0);
  return combined;
};

const timeToStr = (date: Date): string => {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};

const dateToStr = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

@Injectable()
export class EventBookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly venuesService: VenuesService,
  ) {}

  private async checkConflict(
    venueId: number,
    startDate: string,
    endDate: string,
    startTime: string,
    endTime: string,
    excludeId: number | null,
  ) {
    const newStartDateTime = toDateTime(startDate, startTime);
    const newEndDateTime = toDateTime(endDate, endTime);

    const possibleConflicts: EventBookingWithVenue[] =
      await this.prisma.eventBooking.findMany({
        where: {
          venueId,
          bookingStatus: {
            not: BookingStatus.cancelled,
          },
          ...(excludeId !== null && {
            id: {
              not: excludeId,
            },
          }),
          AND: [
            {
              startDate: {
                lte: toDateOnly(endDate),
              },
            },
            {
              endDate: {
                gte: toDateOnly(startDate),
              },
            },
          ],
        },
        include: {
          venue: true,
        },
      });

    const conflicting =
      possibleConflicts.find((booking) => {
        const existingStartDateTime = combineDateAndTime(
          booking.startDate,
          booking.startTime,
        );
        const existingEndDateTime = combineDateAndTime(
          booking.endDate,
          booking.endTime,
        );

        return (
          existingStartDateTime < newEndDateTime &&
          existingEndDateTime > newStartDateTime
        );
      }) ?? null;

    if (conflicting) {
      const conflictStartDate = dateToStr(conflicting.startDate);
      const conflictEndDate = dateToStr(conflicting.endDate);
      const conflictStartTime = timeToStr(conflicting.startTime);
      const conflictEndTime = timeToStr(conflicting.endTime);

      throw new ConflictException(
        `Jadwal bentrok dengan booking "${conflicting.eventName}" ` +
          `pada ${conflictStartDate} sampai ${conflictEndDate}, ` +
          `jam ${conflictStartTime}–${conflictEndTime} di venue yang sama`,
      );
    }
  }

  private buildWhere(
    search?: string,
  ): Prisma.EventBookingWhereInput | undefined {
    if (!search) {
      return undefined;
    }

    const bookingStatus = Object.values(BookingStatus);
    const paymentStatus = Object.values(PaymentStatus);

    return {
      OR: [
        {
          eventName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          organizerName: {
            contains: search,
            mode: 'insensitive',
          },
        },
        ...(bookingStatus.includes(search as BookingStatus)
          ? [
              {
                bookingStatus: {
                  equals: search as BookingStatus,
                },
              },
            ]
          : []),
        ...(paymentStatus.includes(search as PaymentStatus)
          ? [
              {
                paymentStatus: {
                  equals: search as PaymentStatus,
                },
              },
            ]
          : []),
        {
          venue: {
            name: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    };
  }

  async findAll(search?: string) {
    const where = this.buildWhere(search);

    return this.prisma.eventBooking.findMany({
      where,
      include: {
        venue: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findActiveSchedule() {
    return this.prisma.eventBooking.findMany({
      where: {
        bookingStatus: {
          not: BookingStatus.cancelled,
        },
      },
      select: {
        id: true,
        venueId: true,
        eventName: true,
        startDate: true,
        endDate: true,
        startTime: true,
        endTime: true,
      },
    });
  }

  async findPaginated(search: string | undefined, page: number, limit = 10) {
    const where = this.buildWhere(search);
    const pageSize = Math.max(1, limit);
    const totalItems = await this.prisma.eventBooking.count({ where });
    const totalPages = Math.max(Math.ceil(totalItems / pageSize), 1);
    const currentPage = Math.min(Math.max(page, 1), totalPages);

    const bookings = await this.prisma.eventBooking.findMany({
      where,
      include: {
        venue: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (currentPage - 1) * pageSize,
      take: pageSize,
    });

    return {
      bookings,
      pagination: {
        currentPage,
        totalPages,
        totalItems,
        pageSize,
        from: totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1,
        to: Math.min(currentPage * pageSize, totalItems),
        hasPrevious: currentPage > 1,
        hasNext: currentPage < totalPages,
      },
    };
  }

  async findOne(id: number) {
    const booking = await this.prisma.eventBooking.findUnique({
      where: {
        id,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  async findOneWithVenue(id: number) {
    const booking = await this.prisma.eventBooking.findUnique({
      where: {
        id,
      },
      include: {
        venue: true,
      },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  async create(dto: CreateEventBookingDto) {
    const venue = await this.venuesService.findOne(dto.venue_id);

    if (venue.status !== 'available') {
      throw new BadRequestException(
        `Venue "${venue.name}" tidak dapat digunakan karena berstatus ${venue.status}`,
      );
    }

    if (dto.attendees !== undefined && dto.attendees > venue.capacity) {
      throw new BadRequestException(
        `Jumlah peserta (${dto.attendees}) melebihi kapasitas venue "${venue.name}" (${venue.capacity} orang)`,
      );
    }

    const startDateTime = toDateTime(dto.start_date, dto.start_time);
    const endDateTime = toDateTime(dto.end_date, dto.end_time);

    if (endDateTime <= startDateTime) {
      throw new BadRequestException(
        'Tanggal dan waktu selesai harus setelah tanggal dan waktu mulai',
      );
    }

    await this.checkConflict(
      dto.venue_id,
      dto.start_date,
      dto.end_date,
      dto.start_time,
      dto.end_time,
      null,
    );

    return this.prisma.eventBooking.create({
      data: {
        venueId: dto.venue_id,
        eventName: dto.event_name,
        organizerName: dto.organizer_name,
        startDate: toDateOnly(dto.start_date),
        endDate: toDateOnly(dto.end_date),
        startTime: toTimeDate(dto.start_time),
        endTime: toTimeDate(dto.end_time),
        attendees: dto.attendees ?? null,
        bookingStatus: dto.booking_status ?? BookingStatus.pending,
        paymentStatus: dto.payment_status ?? PaymentStatus.unpaid,
        notes: dto.notes ?? null,
      },
      include: {
        venue: true,
      },
    });
  }

  async update(id: number, dto: UpdateEventBookingDto) {
    const existing = await this.findOne(id);

    const effectiveVenueId = dto.venue_id ?? existing.venueId;

    if (dto.venue_id !== undefined && dto.venue_id !== existing.venueId) {
      const newVenue = await this.venuesService.findOne(dto.venue_id);

      if (newVenue.status !== 'available') {
        throw new BadRequestException(
          `Venue "${newVenue.name}" tidak dapat digunakan karena berstatus ${newVenue.status}`,
        );
      }
    }

    const effectiveVenue = await this.venuesService.findOne(effectiveVenueId);

    const effectiveAttendees =
      dto.attendees !== undefined ? dto.attendees : existing.attendees;

    if (
      effectiveAttendees !== null &&
      effectiveAttendees !== undefined &&
      effectiveAttendees > effectiveVenue.capacity
    ) {
      throw new BadRequestException(
        `Jumlah peserta (${effectiveAttendees}) melebihi kapasitas venue "${effectiveVenue.name}" (${effectiveVenue.capacity} orang)`,
      );
    }

    const effectiveStartDate =
      dto.start_date ?? existing.startDate.toISOString().split('T')[0];

    const effectiveEndDate =
      dto.end_date ?? existing.endDate.toISOString().split('T')[0];

    const effectiveStartTime = dto.start_time ?? timeToStr(existing.startTime);
    const effectiveEndTime = dto.end_time ?? timeToStr(existing.endTime);

    const startDateTime = toDateTime(effectiveStartDate, effectiveStartTime);
    const endDateTime = toDateTime(effectiveEndDate, effectiveEndTime);

    if (endDateTime <= startDateTime) {
      throw new BadRequestException(
        'Tanggal dan waktu selesai harus setelah tanggal dan waktu mulai',
      );
    }

    await this.checkConflict(
      effectiveVenueId,
      effectiveStartDate,
      effectiveEndDate,
      effectiveStartTime,
      effectiveEndTime,
      id,
    );

    return this.prisma.eventBooking.update({
      where: {
        id,
      },
      data: {
        ...(dto.venue_id !== undefined && {
          venueId: dto.venue_id,
        }),
        ...(dto.event_name !== undefined && {
          eventName: dto.event_name,
        }),
        ...(dto.organizer_name !== undefined && {
          organizerName: dto.organizer_name,
        }),
        ...(dto.start_date !== undefined && {
          startDate: toDateOnly(dto.start_date),
        }),
        ...(dto.end_date !== undefined && {
          endDate: toDateOnly(dto.end_date),
        }),
        ...(dto.start_time !== undefined && {
          startTime: toTimeDate(dto.start_time),
        }),
        ...(dto.end_time !== undefined && {
          endTime: toTimeDate(dto.end_time),
        }),
        ...(dto.attendees !== undefined && {
          attendees: dto.attendees,
        }),
        ...(dto.booking_status !== undefined && {
          bookingStatus: dto.booking_status,
        }),
        ...(dto.payment_status !== undefined && {
          paymentStatus: dto.payment_status,
        }),
        ...(dto.notes !== undefined && {
          notes: dto.notes,
        }),
      },
      include: {
        venue: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);

    await this.prisma.eventBooking.delete({
      where: {
        id,
      },
    });

    return {
      message: 'Booking berhasil dihapus',
    };
  }
}
