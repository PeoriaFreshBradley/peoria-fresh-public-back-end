import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstraction/base.service';
import { Repository } from 'typeorm';
import { ProduceName } from './entities/produce-name.entity';
@Injectable()
export class ProduceNameService extends BaseService<ProduceName> {
  constructor(
    @InjectRepository(ProduceName)
    protected repository: Repository<ProduceName>,
  ) {
    super(repository);
  }

  relations = ['produce'];
}
