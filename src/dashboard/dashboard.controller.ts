import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { SessionAuthGuard } from '../common/guards/session-auth.guard';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
@UseGuards(SessionAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  async getDashboard(@Req() req: Request, @Res() res: Response) {
    const stats = await this.dashboardService.getStats();
    const user = req.user;

    return res.render('dashboard/index', {
      title: 'Dashboard',
      stats,
      user,
    });
  }
}
