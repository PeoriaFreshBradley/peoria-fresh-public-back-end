import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { lastValueFrom } from 'rxjs';
import { BaseService, CustomQuery } from 'src/abstraction/base.service';
import { ProduceNameService } from 'src/produce-name/produce-name.service';
import { FindOptionsOrder, Like, MetadataAlreadyExistsError, Repository } from 'typeorm';
import { User_badge } from './entities/user_badge';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';

@Injectable()
export class User_badgeService extends BaseService<User_badge> {
  constructor(
    @InjectRepository(User_badge) protected repository: Repository<User_badge>,
    private readonly httpService: HttpService,
  ) {
    super(repository);
  }

  order = {
    name: 'ASC',
  } as FindOptionsOrder<User_badge>;
  relations = [
    'otherNames',
  ];


  sortList = [
  ];

  filterList = [
   
  ]

  override async findAll(query: CustomQuery) {
    return {data: await this.repository.find(),
        metadata: null
    }
  }

  //get all badges for a specific userID
  async findAllforUser(userid: number) {
    return await this.repository.find({
      where: {gardenerId: userid} as any,
    })    
  }
}
