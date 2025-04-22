import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstraction/base.service';
import { Repository } from 'typeorm';
import { FoodBank } from './entities/food-bank.entity';

@Injectable()
export class FoodBankService extends BaseService<FoodBank> {
  constructor(
    @InjectRepository(FoodBank) protected repository: Repository<FoodBank>,
  ) {
    super(repository);
  }

  relations = [];
}
