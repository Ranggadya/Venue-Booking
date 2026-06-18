import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { EventBookingsService } from '../event-bookings.service';
import { CreateEventBookingDto } from '../dto/create-event-booking.dto';
import { UpdateEventBookingDto } from '../dto/update-event-booking.dto';

@Controller('api/event-bookings')
@UseGuards(JwtAuthGuard)
export class EventBookingsApiController {
  constructor(private readonly eventBookingsService: EventBookingsService) {}

  @Get()
  findAll(@Query('search') search: string) {
    return this.eventBookingsService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventBookingsService.findOneWithVenue(Number(id));
  }

  @Post()
  create(@Body() dto: CreateEventBookingDto) {
    return this.eventBookingsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateEventBookingDto) {
    return this.eventBookingsService.update(Number(id), dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    return this.eventBookingsService.remove(Number(id));
  }
}
