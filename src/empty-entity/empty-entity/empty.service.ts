import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { ProduceNameService } from 'src/produce-name/produce-name.service';
import { FindOptionsOrder, Like, Repository } from 'typeorm';
import { Empty } from './entities/empty';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';

@Injectable()
export class EmptyService extends BaseService<Empty> {
  constructor(
    @InjectRepository(Empty) protected repository: Repository<Empty>,
    private readonly httpService: HttpService,
    private produceNameService: ProduceNameService, // services you're dependent on need to be specified here
    private fancyQuery: ExtraProduceQueryAction     // the dependencies are listed in the module file
  ) {
    super(repository);
  }

  order = {
    name: 'ASC',
  } as FindOptionsOrder<Empty>;
  relations = [
    'otherNames',
  ];

  sortByCommReq(sort:any, where: any) {
    if (sort.communityRequest) {
      return {
        isCommunityRequest: 'DESC'
      } as FindOptionsOrder<Empty>;
    }
    else {
      return undefined;
    }
  }

  sortList = [
    this.sortByCommReq
  ];

  // we override the create method so that we can add additional data to the produce from an external API
  override async create(data: Omit<Empty, 'id'>) {
    // validate and manipulate your data in this section before you commit to the database
    const response = super.create(data as any);
    // clean up the response from the database and provide the response as the API should present it
    return response;
  }

  async alphabetFilter(query:CustomQuery, where: any) {
    if (query.alphabetFilter) {
        const letters = query.alphabetFilter.split('');
        where['name'] = Like(`${letters.pop()}%`);
        delete where.alphabetFilter;

        const whereCopy = [where];
        letters.forEach((letter) => {
          whereCopy.push({
            name: Like(`${letter}%`),
          });
        });

        return where;
    }
    return undefined;
  }

  async growingZoneFilter(query:CustomQuery, where: any) {
    if (query.growingZone) {
      return [
          { ...where, growingZone: Like(`%${query.growingZone},%`) },
          { ...where, growingZone: Like(`%${query.growingZone}]`) },
        ];
    }
    return undefined;
  }

  filterList = [
    this.alphabetFilter, 
    this.growingZoneFilter
  ]

  override async findAll(query: CustomQuery) {
      let includeExtra = false;
      if (query.includeExtra) {
        includeExtra = true;
        delete query.includeExtra;
      }
      let allFound = await super.findAll(query);
      if (includeExtra) {
        const aggLocations = await this.fancyQuery.aggregateLocations();
        const aggAmounts = await this.fancyQuery.aggregateRequestAmount();
        const aggGrowings = await this.fancyQuery.aggregateGrowing();
        const aggDelivers = await this.fancyQuery.aggregateDeliveryAmount();
        for (let i of allFound.data) {
          let request = (aggAmounts.get(i.id) !== undefined ? aggAmounts.get(i.id) : 0);
          let growing = (aggGrowings.get(i.id) !== undefined ? aggGrowings.get(i.id) : 0);
          let delivered = (aggDelivers.get(i.id) !== undefined ? aggDelivers.get(i.id) : 0);
          let diff = request - (growing + delivered);
          i.extra = {
            isCommunityRequest: diff > 0,
            totalAmount: Math.max(diff, 0),
            locations: (aggLocations.get(i.id) === undefined ? [] : Array.from(aggLocations.get(i.id)))
          };
        }
      }
      return allFound;
  }

  // we add a secondary query handler to handle the search by name and search across our other names table
  secondaryQueryHandler = async (query: CustomQuery) => {
    if (query.searchKey === 'name') {
      const produceNames = await this.produceNameService.findAll({
        name: Like(`%${query.searchValue}%`),
      });
      const produce = [];

      delete query.searchKey;
      delete query.searchValue;

      // Deletes parts from the query that aren't part of the table in the database (to avoid crashing mid-query because the column was not found)
      delete query.limit;
      delete query.page;

      for (const produceName of produceNames.data) {
        const produceItem = await this.repository.findOne({
          where: { ...query, id: produceName.produce?.id },
          relations: this.relations,
        });
        if (produceItem) produce.push(produceItem);
      }
      return produce;
    }
    return [];
  };
}
