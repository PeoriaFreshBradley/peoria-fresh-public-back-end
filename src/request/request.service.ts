import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstraction/base.service';
import { ProduceService } from 'src/produce/produce.service';
import { Repository } from 'typeorm';
import { Request } from './entities/request.entity';
import { LocationService } from 'src/location/location.service';

@Injectable()
export class RequestService extends BaseService<Request> {
  constructor(
    @InjectRepository(Request) protected repository: Repository<Request>,
    private produceService: ProduceService,
    private locationService: LocationService
  ) {
    super(repository);
  }

  /**
   * Does multiplication to turn the amount requested per day to pounds of food that gardeners can grow.
   * If a Location is specified, then it tries to create it if it doesn't already exist.
   * @param data Request type information
   * @returns insertion query result
   */
  override async create(data: Omit<Request, 'id'>) {
    const produce = await this.produceService.findOne(data.produce.id);
    data.amount *= data.numPeople;
    if (produce.unitMultiplier) {
      data.amount *= produce.unitMultiplier;
    }

    Math.ceil(data.amount);

    if (data.location === null) delete data.location;
    else {
      data.location.deliveries = null;
      data.location.requestLocations = null;
      let locId = await this.locationService.create(data.location);
      if (locId === null) data.location = null;
      else                data.location = await this.locationService.getOne(locId.id);
    }

    data.requestDate = data.requestDate || new Date();
    data.requestFrom = data.requestFrom || null;
    return await this.repository.save(data);
  }

  relations = ['produce', 'foodBank'];
}
