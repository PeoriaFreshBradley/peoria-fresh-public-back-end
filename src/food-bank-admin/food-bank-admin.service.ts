import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BaseService } from 'src/abstraction/base.service';
import { DeepPartial, Repository } from 'typeorm';
import { FoodBankAdmin } from './entities/food-bank-admin.entity';

@Injectable()
export class FoodBankAdminService extends BaseService<FoodBankAdmin> {
  constructor(
    @InjectRepository(FoodBankAdmin) protected repository: Repository<FoodBankAdmin>,
  ) {
    super(repository);
  }
  
  override async create(data: Omit<FoodBankAdmin, 'id'>) {
    const exists = await this.repository.findOne({
      where: {
        invitationEmail: data.invitationEmail
      }
    });
    if (!exists)
      return this.repository.save(data as DeepPartial<FoodBankAdmin>);
    else
      return null;
  }


  relations = ['foodBank', 'foodBank.location'];
}
