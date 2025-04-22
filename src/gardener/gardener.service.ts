import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstraction/base.service';
import { Repository } from 'typeorm';
import { Gardener } from './entities/gardener.entity';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';

@Injectable()
export class GardenerService extends BaseService<Gardener> {
  constructor(
    @InjectRepository(Gardener) protected repository: Repository<Gardener>,

        private fancyQuery: ExtraProduceQueryAction
    
  ) {
    super(repository);
  }

  async getLeaderboard(){

    return await this.fancyQuery.getLeaderboard();

  }
  relations = ['growings'];
}
