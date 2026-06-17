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
import { VenuesService } from '../venues.service';
import { CreateVenueDto } from '../dto/create-venue.dto';
import { UpdateVenueDto } from '../dto/update-venue.dto';

@Controller('api/venues')
@UseGuards(JwtAuthGuard)
export class VenuesApiController {
  constructor(private readonly venuesService: VenuesService) {}

  @Get()
  findAll(@Query('search') search?: string) {
    return this.venuesService.findAll(search);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOneWithBookings(Number(id));
  }

  @Post()
  create(@Body() createVenueDto: CreateVenueDto) {
    return this.venuesService.create(createVenueDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVenueDto: UpdateVenueDto) {
    return this.venuesService.update(Number(id), updateVenueDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  delete(@Param('id') id: string) {
    return this.venuesService.remove(Number(id));
  }
}
