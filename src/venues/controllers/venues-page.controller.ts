import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionAuthGuard } from '../../common/guards/session-auth.guard';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { UpdateVenueDto } from '../dto/update-venue.dto';
import { VenuesService } from '../venues.service';

@Controller('venues')
@UseGuards(SessionAuthGuard)
export class VenuesPageController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  async index(
    @Query('search') search: string | undefined,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const venues = await this.venuesService.findAll(search);

    return res.render('venues/index', {
      title: 'Venues - Smart Venue Booking',
      pageTitle: 'Venues',
      venues,
      search: search ?? '',
      success: req.flash('success'),
      error: req.flash('error'),
    });
  }

  @Get('create')
  createPage(@Req() req: Request, @Res() res: Response) {
    return res.render('venues/create', {
      title: 'Create Venue - Smart Venue Booking',
      pageTitle: 'Create Venue',
      error: req.flash('error'),
    });
  }

  @Post()
  async create(
    @Body() createVenueDto: CreateVenueDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.venuesService.create(createVenueDto);

      req.flash('success', 'Venue berhasil ditambahkan');
      return res.redirect('/venues');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Venue gagal ditambahkan';

      req.flash('error', message);
      return res.redirect('/venues/create');
    }
  }

  @Get(':id')
  async show(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const venue = await this.venuesService.findOneWithBookings(Number(id));

      return res.render('venues/show', {
        title: `${venue.name} - Smart Venue Booking`,
        pageTitle: 'Venue Detail',
        venue,
        success: req.flash('success'),
        error: req.flash('error'),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Venue tidak ditemukan';

      req.flash('error', message);
      return res.redirect('/venues');
    }
  }

  @Get(':id/edit')
  async editPage(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const venue = await this.venuesService.findOne(Number(id));

      return res.render('venues/edit', {
        title: `Edit ${venue.name} - Smart Venue Booking`,
        pageTitle: 'Edit Venue',
        venue,
        error: req.flash('error'),
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Venue tidak ditemukan';

      req.flash('error', message);
      return res.redirect('/venues');
    }
  }

  @Post(':id/update')
  async update(
    @Param('id') id: string,
    @Body() updateVenueDto: UpdateVenueDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.venuesService.update(Number(id), updateVenueDto);

      req.flash('success', 'Venue berhasil diperbarui');
      return res.redirect(`/venues/${id}`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Venue gagal diperbarui';

      req.flash('error', message);
      return res.redirect(`/venues/${id}/edit`);
    }
  }

  @Post(':id/delete')
  async delete(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      await this.venuesService.remove(Number(id));

      req.flash('success', 'Venue berhasil dihapus');
      return res.redirect('/venues');
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Venue gagal dihapus';

      req.flash('error', message);
      return res.redirect('/venues');
    }
  }
}
