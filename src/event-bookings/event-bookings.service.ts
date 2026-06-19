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
// helper function

const toTimeDate = (timeStr: string): Date => {
  const [hours, minute] = timeStr.split(':').map(Number);
  const date = new Date(0);
  date.setUTCHours(hours, minute, 0, 0);
  return date;
};

const toDateOnly = (dateStr: string): Date => {
  return new Date(dateStr + 'T00:00:00.000Z');
};

const timeToStr = (date: Date): string => {
  const h = date.getUTCHours().toString().padStart(2, '0');
  const m = date.getUTCMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
};
@Injectable()
export class EventBookingsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly venuesService: VenuesService,
  ) {}

  private async checkConflict(
    venueId: number,
    eventDate: string,
    startTime: string,
    endTime: string,
    excludeId: number | null,
  ) {
    const startDate = toTimeDate(startTime);
    const endDate = toTimeDate(endTime);
    const dateOnly = toDateOnly(eventDate);

    const conflicting = await this.prisma.eventBooking.findFirst({
      where: {
        venueId,
        eventDate: dateOnly,
        bookingStatus: { not: 'cancelled' }, // cancelled tidak dihitung konflik
        // Kalau excludeId ada (saat update), kecualikan booking itu dari pengecekan
        ...(excludeId !== null && { id: { not: excludeId } }),
        AND: [
          { startTime: { lt: endDate } }, // booking lama mulai < waktu selesai baru
          { endTime: { gt: startDate } }, // booking lama selesai > waktu mulai baru
        ],
      },
      include: { venue: true },
    });

    if (conflicting) {
      // Beri pesan error yang informatif — admin tahu booking mana yang konflik
      const konflikStart = timeToStr(conflicting.startTime);
      const konflikEnd = timeToStr(conflicting.endTime);
      throw new ConflictException(
        `Jadwal bentrok dengan booking "${conflicting.eventName}" ` +
          `pada ${konflikStart}–${konflikEnd} di venue yang sama`,
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
        { eventName: { contains: search, mode: 'insensitive' } },
        { organizerName: { contains: search, mode: 'insensitive' } },

        ...(bookingStatus.includes(search as BookingStatus)
          ? [{ bookingStatus: { equals: search as BookingStatus } }]
          : []),
        ...(paymentStatus.includes(search as PaymentStatus)
          ? [{ paymentStatus: { equals: search as PaymentStatus } }]
          : []),
        {
          venue: {
            name: { contains: search, mode: 'insensitive' },
          },
        },
      ],
    };
  }

  async findAll(search?: string) {
    const where = this.buildWhere(search);

    return this.prisma.eventBooking.findMany({
      where,
      include: { venue: true },
      orderBy: { createdAt: 'desc' },
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
      include: { venue: true },
      orderBy: { createdAt: 'desc' },
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
      where: { id },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  async findOneWithVenue(id: number) {
    const booking = await this.prisma.eventBooking.findUnique({
      where: { id },
      include: { venue: true },
    });

    if (!booking) {
      throw new NotFoundException(`Booking dengan ID ${id} tidak ditemukan`);
    }

    return booking;
  }

  async create(dto: CreateEventBookingDto) {
    const venue = await this.venuesService.findOne(dto.venue_id);

    //  Cek status venue harus 'available'
    if (venue.status !== 'available') {
      throw new BadRequestException(
        `Venue "${venue.name}" tidak dapat digunakan karena berstatus ${venue.status}`,
      );
    }

    // Cek jumlah peserta tidak melebihi kapasitas
    if (dto.attendees !== undefined && dto.attendees > venue.capacity) {
      throw new BadRequestException(
        `Jumlah peserta (${dto.attendees}) melebihi kapasitas venue "${venue.name}" (${venue.capacity} orang)`,
      );
    }

    const startDate = toTimeDate(dto.start_time);
    const endDate = toTimeDate(dto.end_time);

    if (endDate <= startDate) {
      throw new BadRequestException(
        'Waktu selesai harus lebih besar dari waktu mulai',
      );
    }

    // Cek konflik jadwal dengan booking lain
    await this.checkConflict(
      dto.venue_id,
      dto.event_date,
      dto.start_time,
      dto.end_time,
      null,
    );

    return this.prisma.eventBooking.create({
      data: {
        venueId: dto.venue_id,
        eventName: dto.event_name,
        organizerName: dto.organizer_name,
        eventDate: toDateOnly(dto.event_date),
        startTime: toTimeDate(dto.start_time),
        endTime: toTimeDate(dto.end_time),
        attendees: dto.attendees ?? null,
        bookingStatus: dto.booking_status ?? 'pending',
        paymentStatus: dto.payment_status ?? 'unpaid',
        notes: dto.notes ?? null,
      },
      include: { venue: true },
    });
  }

  async update(id: number, dto: UpdateEventBookingDto) {
    // Step 1: Pastikan booking ada
    const existing = await this.findOne(id);

    // Step 2: Tentukan nilai efektif (dto override nilai lama dari DB)
    // Kalau dto tidak mengirim field tertentu, gunakan nilai yang sudah ada
    const effectiveVenueId = dto.venue_id ?? existing.venueId;

    // Step 3: Jika venue berubah, cek venue baru ada & available
    if (dto.venue_id !== undefined && dto.venue_id !== existing.venueId) {
      const newVenue = await this.venuesService.findOne(dto.venue_id);
      if (newVenue.status !== 'available') {
        throw new BadRequestException(
          `Venue "${newVenue.name}" tidak dapat digunakan karena berstatus ${newVenue.status}`,
        );
      }
    }

    // Step 4: Cek kapasitas dengan venue efektif
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

    // Step 5: Tentukan nilai waktu efektif untuk conflict check
    // Jika dto tidak kirim waktu, ambil dari DB dan konversi balik ke string
    const effectiveEventDate =
      dto.event_date ?? existing.eventDate.toISOString().split('T')[0];
    const effectiveStartTime = dto.start_time ?? timeToStr(existing.startTime);
    const effectiveEndTime = dto.end_time ?? timeToStr(existing.endTime);

    // Step 6: Validasi waktu
    const startDate = toTimeDate(effectiveStartTime);
    const endDate = toTimeDate(effectiveEndTime);
    if (endDate <= startDate) {
      throw new BadRequestException(
        'Waktu selesai harus lebih besar dari waktu mulai',
      );
    }

    // Step 7: Cek konflik jadwal (kecualikan booking ini sendiri)
    await this.checkConflict(
      effectiveVenueId,
      effectiveEventDate,
      effectiveStartTime,
      effectiveEndTime,
      id,
    );

    // Step 8: Update hanya field yang dikirim (spread conditional)
    return this.prisma.eventBooking.update({
      where: { id },
      data: {
        ...(dto.venue_id !== undefined && { venueId: dto.venue_id }),
        ...(dto.event_name !== undefined && { eventName: dto.event_name }),
        ...(dto.organizer_name !== undefined && {
          organizerName: dto.organizer_name,
        }),
        ...(dto.event_date !== undefined && {
          eventDate: toDateOnly(dto.event_date),
        }),
        ...(dto.start_time !== undefined && {
          startTime: toTimeDate(dto.start_time),
        }),
        ...(dto.end_time !== undefined && {
          endTime: toTimeDate(dto.end_time),
        }),
        ...(dto.attendees !== undefined && { attendees: dto.attendees }),
        ...(dto.booking_status !== undefined && {
          bookingStatus: dto.booking_status,
        }),
        ...(dto.payment_status !== undefined && {
          paymentStatus: dto.payment_status,
        }),
        ...(dto.notes !== undefined && { notes: dto.notes }),
      },
      include: { venue: true },
    });
  }

  // ─── REMOVE ───────────────────────────────────────────────────
  async remove(id: number) {
    // Pastikan booking ada dulu
    await this.findOne(id);
    await this.prisma.eventBooking.delete({ where: { id } });
    return { message: 'Booking berhasil dihapus' };
  }
}
