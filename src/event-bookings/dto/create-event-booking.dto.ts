import {
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BookingStatus, PaymentStatus } from '@prisma/client';

export class CreateEventBookingDto {
  @IsNotEmpty({ message: 'Venue wajib dipilih' })
  @Type(() => Number)
  @IsInt()
  venue_id!: number;

  @IsNotEmpty({ message: 'Nama event wajib diisi' })
  @IsString()
  @MaxLength(150)
  event_name!: string;

  @IsNotEmpty({ message: 'Nama penyelenggara wajib diisi' })
  @IsString()
  @MaxLength(100)
  organizer_name!: string;

  @IsNotEmpty({ message: 'Tanggal event wajib diisi' })
  @IsDateString(
    {},
    { message: 'Format tanggal tidak valid (gunakan YYYY-MM-DD)' },
  )
  // @IsDateString memvalidasi format "2026-06-15"
  event_date!: string;

  @IsNotEmpty({ message: 'Waktu mulai wajib diisi' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format waktu tidak valid (gunakan HH:MM)',
  })
  // Regex memastikan format "08:00" atau "23:59"
  start_time!: string;

  @IsNotEmpty({ message: 'Waktu selesai wajib diisi' })
  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Format waktu tidak valid (gunakan HH:MM)',
  })
  end_time!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1, { message: 'Jumlah peserta minimal 1' })
  attendees?: number;

  @IsOptional()
  @IsEnum(BookingStatus, {
    message: 'Status booking harus pending, confirmed, atau cancelled',
  })
  booking_status?: BookingStatus;

  @IsOptional()
  @IsEnum(PaymentStatus, {
    message: 'Status pembayaran harus unpaid, paid, atau refunded',
  })
  payment_status?: PaymentStatus;

  @IsOptional()
  @IsString()
  notes?: string;
}
