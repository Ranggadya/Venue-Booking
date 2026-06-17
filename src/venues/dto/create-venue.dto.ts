import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { VenueStatus } from '@prisma/client';

export class CreateVenueDto {
  @IsNotEmpty({ message: 'Nama venue wajib diisi' })
  @IsString()
  @MaxLength(150, { message: 'Nama venue maksimal 150 karakter' })
  name!: string;

  @IsNotEmpty({ message: 'Lokasi wajib diisi' })
  @IsString()
  @MaxLength(255, { message: 'Lokasi maksimal 255 karakter' })
  location!: string;

  @IsNotEmpty({ message: 'Kapasitas wajib diisi' })
  @Type(() => Number)
  @IsNumber()
  @Min(1, { message: 'Kapasitas minimal 1 peserta' })
  capacity!: number;

  @IsOptional()
  @IsString()
  facilities?: string;

  @IsNotEmpty({ message: 'Harga per hari wajib diisi' })
  @Type(() => Number)
  @IsNumber()
  @Min(0, { message: 'Harga tidak boleh negatif' })
  price_per_day!: number;

  @IsNotEmpty({ message: 'Status wajib diisi' })
  @IsEnum(VenueStatus, {
    message: 'Status harus available, maintenance, atau inactive',
  })
  status!: VenueStatus;

  @IsOptional()
  @IsString()
  description?: string;
}
