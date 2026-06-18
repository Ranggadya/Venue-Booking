import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { EventBookingsService } from '../event-bookings.service';
import { VenuesService } from '../../venues/venues.service';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { CreateEventBookingDto } from '../dto/create-event-booking.dto';
import { UpdateEventBookingDto } from '../dto/update-event-booking.dto';

@Controller('event-bookings')
@UseGuards(SessionAuthGuard)
export class EventBookingsPageController {
  constructor(
    private readonly eventBookingsService: EventBookingsService,
    // Inject VenuesService untuk mengisi dropdown venue di form create/edit
    private readonly venuesService: VenuesService,
  ) {}

  // ─── GET /event-bookings ──────────────────────────────────────
  @Get()
  async index(
    @Query('search') search: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const bookings = await this.eventBookingsService.findAll(search);
    const user = req.user;

    return res.render('event-bookings/index', {
      title: 'Event Bookings',
      bookings,
      search: search ?? '',
      user,
      messages: {
        success: req.flash('success'),
        error: req.flash('error'),
      },
    });
  }

  // ─── GET /event-bookings/create ───────────────────────────────
  @Get('create')
  async createForm(@Req() req: Request, @Res() res: Response) {
    // Load daftar venue untuk dropdown — hanya yang available saja ditampilkan
    // Admin tidak bisa booking venue yang maintenance/inactive
    const venues = await this.venuesService.findAll();
    const user = req.user;

    return res.render('event-bookings/create', {
      title: 'Tambah Booking',
      // Kirim semua venue tapi nanti di view kita filter available
      venues,
      user,
      messages: {
        success: req.flash('success'),
        error: req.flash('error'),
      },
    });
  }

  // ─── POST /event-bookings ─────────────────────────────────────
  @Post()
  async create(
    @Body() body: CreateEventBookingDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.eventBookingsService.create(body);
      req.flash('success', 'Booking berhasil dibuat');
      return res.redirect('/event-bookings');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal membuat booking';
      req.flash('error', message);
      return res.redirect('/event-bookings/create');
    }
  }

  // ─── GET /event-bookings/:id ──────────────────────────────────
  @Get(':id')
  async show(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const booking = await this.eventBookingsService.findOneWithVenue(
        Number(id),
      );
      const user = req.user;

      return res.render('event-bookings/show', {
        title: `Detail Booking — ${booking.eventName}`,
        booking,
        user,
        messages: {
          success: req.flash('success'),
          error: req.flash('error'),
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Detail booking gagal dimuat';
      req.flash('error', message);
      return res.redirect('/event-bookings');
    }
  }

  // ─── GET /event-bookings/:id/edit ─────────────────────────────
  @Get(':id/edit')
  async editForm(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const booking = await this.eventBookingsService.findOneWithVenue(
        Number(id),
      );
      const venues = await this.venuesService.findAll();
      const user = req.user;

      return res.render('event-bookings/edit', {
        title: `Edit Booking — ${booking.eventName}`,
        booking,
        venues,
        user,
        messages: {
          success: req.flash('success'),
          error: req.flash('error'),
        },
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Detail booking gagal dimuat';
      req.flash('error', message);
      return res.redirect('/event-bookings');
    }
  }

  // ─── POST /event-bookings/:id/update ──────────────────────────
  @Post(':id/update')
  async update(
    @Param('id') id: string,
    @Body() body: UpdateEventBookingDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.eventBookingsService.update(Number(id), body);
      req.flash('success', 'Booking berhasil diperbarui');
      return res.redirect(`/event-bookings/${id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal memperbarui booking';
      req.flash('error', message);
      return res.redirect(`/event-bookings/${id}/edit`);
    }
  }

  // ─── POST /event-bookings/:id/delete ──────────────────────────
  @Post(':id/delete')
  async remove(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.eventBookingsService.remove(Number(id));
      req.flash('success', 'Booking berhasil dihapus');
      return res.redirect('/event-bookings');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Gagal menghapus booking';
      req.flash('error', message);
      return res.redirect(`/event-bookings/${id}`);
    }
  }
}
