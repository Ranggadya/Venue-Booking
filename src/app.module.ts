import { Module, Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { VenuesModule } from './venues/venues.module';
import { EventBookingsModule } from './event-bookings/event-bookings.module';

@Controller()
class RootController {
  @Get()
  redirectRoot(@Res() res: Response) {
    return res.redirect('/login');
  }
}

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    UsersModule,
    AuthModule,
    DashboardModule,
    VenuesModule,
    EventBookingsModule,
  ],
  controllers: [RootController],
})
export class AppModule {}
