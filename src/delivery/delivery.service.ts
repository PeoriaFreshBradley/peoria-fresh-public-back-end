import { Delivery } from './entities/delivery.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeliveryRepository } from './delivery.repository';
import { CustomQuery } from 'src/abstraction/base.service';
import { Like } from 'typeorm';
import { LocationService } from 'src/location/location.service';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';
import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';


export class DeliveryService {
  constructor(
    @InjectRepository(Delivery) protected repository: DeliveryRepository,
    protected locationService: LocationService
  ) {}

  // create resource
  async create(data: Omit<Delivery, 'id'>) {
    data.isVerified = false;
    data.verifiedAmount = null;
    if (data.location === null) delete data.location;
    else {
      data.location.deliveries = null;
      data.location.requestLocations = null;
      let locId = await this.locationService.create(data.location);
      if (locId === null) data.location = null;
      else                data.location = await this.locationService.getOne(locId.id);
    }
    return this.repository.save(data);
  }

  async getOne(findId: number) {
    let result = await this.repository.findOne({
      where: {
        id: findId
      }
    });
    return result;
  }

  async getAllForUser(userId: number, query: CustomQuery) {
    query['provider.id'] = userId;
    query.limit = -1;
    return this.getAll(query);
  }

  async verifyDelivery(deliveryId: number, verifiedAmount: number, verifiedBy: Partial<FoodBankAdmin>) {
    const currentDelivery = await this.repository.findOne({
      where: {
        id: deliveryId
      }
    });
    if (currentDelivery) {
      if (currentDelivery.isVerified) throw new ForbiddenException("This delivery has already been verified.");
      if (!verifiedAmount) throw new BadRequestException("You need to specify how much you actually received.");
      const payload = {
        verifiedAmount,
        verifiedBy,
        isVerified: true
      }
      return this.repository.update(deliveryId, payload as Partial<Delivery>);
    }
    else {
      throw new NotFoundException("This delivery does not exist.");
    }

  }

  async getAll(query?: CustomQuery) {
    if (query.includeExtra) delete query.includeExtra; // in case not properly scrubbed
    let where = { ...query };
    // can be used to parse out search queries which are formatted like this: ?searchKey=name&searchValue=apple
    // where the searchKey is the column name and the searchValue is the value to search for
    if (!!query.searchKey) {
      where[`${query.searchKey}`] = Like(`%${query.searchValue}%`);
      delete where.searchKey;
      delete where.searchValue;
    }

    // we return the pagination metadata as well as the data so that the client can use it to paginate and know what page and pagesize the current data is
    const paginationMetadata = {
      page: 1,
      limit: 10,
    };
    if (query.page) {
      paginationMetadata.page = query.page;
      delete where.page;
    }
    if (query.limit) {
      if (query.limit == -1) {
        query.limit = 1000000;
        paginationMetadata.limit = 1000000;
        paginationMetadata.page = 1;
      }
      else
        paginationMetadata.limit = query.limit;
      delete where.limit;
    }

    // we need to convert the page and limit into skip and take for typeorm
    const pagination = {
      skip: (paginationMetadata.page - 1) * paginationMetadata.limit,
      take: paginationMetadata.limit,
    };

    let data;
    let count;

    // Apply the filter function
    // This will iterate through all defined filter functions and will use the last applicable filter to the query

    let ordering;

    // Check that the query wants to be sorted
    if (query.sort) {
      // Apply the sorter function (if it applies to the query).
      // It will iterate through the list and ultimately apply the last relevant sorter onto the output
      // this stops *properly formatted* sort queries from crashing when a sort is included
      // Basically just get rid of the sort object so it doesn't try to do a WHERE statement on something that represents an ORDER BY
      delete where.sort;
    }

    // execute the query with all sorts and filters applied
    [data, count] = await this.repository.findAndCount({
      where: where as any,
      order: ordering,
      relations: ['location', 'produce', 'provider'],
      ...pagination,
    });

    return {
      data,
      metadata: {
        pages: Math.ceil(count / (query.limit || 10)),
        count,
        ...paginationMetadata,
      },
    };
  }
}
