import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionAuthGuard } from 'src/common/guards/session-auth.guard';
import { User } from '@prisma/client';
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
    const user = (req as Request & { user?: User }).user;

    return res.render('venues/index', {
      title: 'Venues Booking',
      pageTitle: 'Venues',
      venues,
      search: search ?? '',
      user,
      message: {
        success: req.flash('success'),
        error: req.flash('error'),
      },
    });
  }
}
