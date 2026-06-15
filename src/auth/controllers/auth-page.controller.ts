import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { LocalAuthGuard } from 'src/common/guards/local-auth.guard';

@Controller()
export class AuthPageController {
  @Get('login')
  getLogin(@Req() req: Request, @Res() res: Response) {
    if (req.isAuthenticated()) {
      return res.redirect('/dashboard');
    }

    return res.render('auth/login', {
      layout: false,
      title: 'Login - Venue Booking',
      error: req.flash('error'),
      success: req.flash('success'),
    });
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  postLogin(@Req() req: Request, @Res() res: Response) {
    req.flash('success', 'Login berhasil. Selamat Datang Kembali');
    return res.redirect('/dashboard');
  }

  @Post('logout')
  postLogout(@Req() req: Request, @Res() res: Response) {
    req.logOut(() => {
      req.session.destroy(() => {
        res.clearCookie('connect.id');
        return res.redirect('/login');
      });
    });
  }
}
