import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { LocationService } from './location.service';
import { UserAbilities } from 'src/abstraction/base.controller';
import { Location } from 'src/location/entities/location.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('locations')
@ApiTags('Locations')
export class LocationController {
  constructor(protected service: LocationService) {
  }

  protected userAbilities?: UserAbilities<Location>;

  // The location object should be internally managed. Not accessisble to create/update/delete from the API, only from actions on other objects.
  //@Post()
  //create(@Body() data: Partial<Location>) {
  //  return this.service.create(data);
  //}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let result = await this.service.getOne(+id);
    if (result === null) throw new NotFoundException();
    // Scrub data from result not directly relevant to pinning it on a map
    result.deliveries = null;
    result.requestLocations = null; 
    return result;
  }
}