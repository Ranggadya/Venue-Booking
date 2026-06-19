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
    private readonly venuesService: VenuesService,
  ) {}

  @Get()
  async index(
    @Query('search') search: string,
    @Query('page') page: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const currentPage = Number.parseInt(page ?? '1', 10);

    const result = await this.eventBookingsService.findPaginated(
      search,
      Number.isNaN(currentPage) ? 1 : currentPage,
    );

    return res.render('event-bookings/index', {
      title: 'Event Bookings - Venue Booking',
      pageTitle: 'Event Bookings',
      bookings: result.bookings,
      pagination: result.pagination,
      search: search ?? '',
      success: req.flash('success'),
      error: req.flash('error'),
    });
  }

  @Get('create')
  async createForm(@Req() req: Request, @Res() res: Response) {
    const venues = await this.venuesService.findAll();
    const activeBookings = await this.eventBookingsService.findActiveSchedule();
    const oldInput = this.getOldInput(req);

    return res.render('event-bookings/create', {
      title: 'Create Event Booking - Venue Booking',
      pageTitle: 'Create Event Booking',
      venues,
      activeBookings,
      oldInput,
      success: req.flash('success'),
      error: req.flash('error'),
    });
  }

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
      req.flash('formData', JSON.stringify(body));
      return res.redirect('/event-bookings/create');
    }
  }

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

      return res.render('event-bookings/show', {
        title: `Detail Booking - ${booking.eventName}`,
        pageTitle: 'Booking Detail',
        booking,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Detail booking gagal dimuat';

      req.flash('error', message);
      return res.redirect('/event-bookings');
    }
  }

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
      const oldInput = this.getOldInput(req);

      return res.render('event-bookings/edit', {
        title: `Edit Booking - ${booking.eventName}`,
        pageTitle: 'Edit Event Booking',
        booking,
        venues,
        oldInput,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Detail booking gagal dimuat';

      req.flash('error', message);
      return res.redirect('/event-bookings');
    }
  }

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
      req.flash('formData', JSON.stringify(body));
      return res.redirect(`/event-bookings/${id}/edit`);
    }
  }

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

  private getOldInput(req: Request): Record<string, unknown> {
    const [raw] = req.flash('formData');

    if (!raw) {
      return {};
    }

    try {
      const parsed = JSON.parse(raw) as unknown;
      return parsed && typeof parsed === 'object'
        ? (parsed as Record<string, unknown>)
        : {};
    } catch {
      return {};
    }
  }
}
