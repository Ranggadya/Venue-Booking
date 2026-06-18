import { Module } from '@nestjs/common';
import { EventBookingsService } from './event-bookings.service';
import { VenuesModule } from 'src/venues/venues.module';
import { EventBookingsApiController } from './controllers/event-bookings-api.controller';
import { EventBookingsPageController } from './controllers/event-bookings-page.controller';

@Module({
  imports: [VenuesModule],
  controllers: [EventBookingsApiController, EventBookingsPageController],
  providers: [EventBookingsService],
  exports: [EventBookingsService],
})
export class EventBookingsModule {}
