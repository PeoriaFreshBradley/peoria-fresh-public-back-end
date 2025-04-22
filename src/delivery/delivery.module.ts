import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Delivery } from './entities/delivery.entity';
import { DeliveryController } from './delivery.controller';
import { DeliveryService } from './delivery.service';
import { LocationModule } from 'src/location/location.module';
import { GardenerRepository } from 'src/gardener/gardener.repository';
import { FoodBankAdminRepository } from 'src/food-bank-admin/food-bank-admin.repository';
import { FoodBankRepository } from 'src/food-bank/food-bank.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Delivery]), forwardRef(() => AuthModule), forwardRef(() => LocationModule)],
  controllers: [DeliveryController],
  providers: [DeliveryService, GardenerRepository, FoodBankAdminRepository, FoodBankRepository, UserRepository],
  exports: [DeliveryService],
})
export class DeliveryModule {}
