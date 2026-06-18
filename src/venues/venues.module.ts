import { Module } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { VenuesApiController } from './controllers/venues-api.controller';
import { VenuesPageController } from './controllers/venues-page.controller';

@Module({
  controllers: [VenuesApiController, VenuesPageController],
  providers: [VenuesService],
  exports: [VenuesService],
})
export class VenuesModule {}
