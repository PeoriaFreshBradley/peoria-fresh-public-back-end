import { forwardRef, Module } from '@nestjs/common';
import { FoodBankAdminService } from './food-bank-admin.service';
import { FoodBankAdminController } from './food-bank-admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodBankAdmin } from './entities/food-bank-admin.entity';
import { AuthModule } from 'src/auth/auth.module';
import { UserRepository } from 'src/user/user.repository';
import { FoodBankAdminRepository } from './food-bank-admin.repository';
import { RequestRepository } from 'src/request/request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FoodBankAdmin]), forwardRef(() => AuthModule)],
  controllers: [FoodBankAdminController],
  providers: [FoodBankAdminService, UserRepository, FoodBankAdminRepository, RequestRepository],
  exports: [FoodBankAdminService],
})
export class FoodBankAdminModule {}
