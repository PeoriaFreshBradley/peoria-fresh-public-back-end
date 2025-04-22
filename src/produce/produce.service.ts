import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { ProduceNameService } from 'src/produce-name/produce-name.service';
import { FindOptionsOrder, Like, Repository } from 'typeorm';
import { Produce } from './entities/produce.entity';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';

@Injectable()
export class ProduceService extends BaseService<Produce> {
  constructor(
    @InjectRepository(Produce) protected repository: Repository<Produce>,
    private readonly httpService: HttpService,
    private produceNameService: ProduceNameService, 
    private fancyQuery: ExtraProduceQueryAction
  ) {
    super(repository);
  }

  order = {
    name: 'ASC',
  } as FindOptionsOrder<Produce>;
  relations = [
    'otherNames',
  ];

  /**
   * Put community requests at the top of the list.
   *  
   */
  sortByCommReq(sort:any, where: any) {
    if (sort.communityRequest) {
      return {
        isCommunityRequest: 'DESC'
      } as FindOptionsOrder<Produce>;
    }
    else {
      return undefined;
    }
  }

  sortList = [
    this.sortByCommReq
  ];

  // we override the create method so that we can add additional data to the produce from an external API
  /**
   * Allowing users to create produce is not a good idea. This should be re-evaluated and deleted at some point. 
   * @deprecated
   * @param data 
   * @returns created produce object
   */
  override async create(data: Omit<Produce, 'id'>) {
    if (data.newFlag != false) {
      // get data from 3rd party API
      const query = data.name.replace(/ /g, '-')?.replace(/"/g, '');

      const additionalData = (
        (await lastValueFrom(
          this.httpService.get(
            `https://openfarm.cc/api/v1/crops?filter=${query}`,
          ),
        )) as any
      )?.data?.data?.[0];

      if (additionalData) {
        const additionalImages = (
          (await lastValueFrom(
            this.httpService.get(
              `https://openfarm.cc/api/v1/crops/${additionalData.id}/pictures`,
            ),
          )) as any
        )?.data?.data?.[0];

        data.description =
          data.description || additionalData.attributes.description;

        if (additionalImages) {
          data.largePhotoURL =
            data.largePhotoURL || additionalImages.attributes['large_url'];
          data.smallPhotoURL =
            data.smallPhotoURL || additionalImages.attributes['small_url'];
        }

        data.otherNames =
          data.otherNames || additionalData.attributes.common_names;
      }
    }
    const response = await this.repository.save(data as any);

    // create additional names
    if (data.otherNames) {
      (data.otherNames as unknown as string[]).forEach(async (name) => {
        if (name != data.name)
          this.produceNameService.create({
            name,
            produce: response,
          } as any);
      });
    }

    return response;
  }

  /**
   * Filter down by matching names. 
   * @param query The original query
   * @param where Additional searching restrictions
   * @returns the data
   */
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


  /**
   * If we want all community needs data, do the proper aggregation. We only do aggregation if explicitly asked to do so 
   * because otherwise, we would be doing a lot of extra aggregation queries and logic and wasting CPU when we may not need it.
   * @param query CustomQuery type
   * @returns produce matching the criteria
   */
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
