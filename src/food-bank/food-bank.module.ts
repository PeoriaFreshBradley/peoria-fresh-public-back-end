import { forwardRef, Module } from '@nestjs/common';
import { FoodBankService } from './food-bank.service';
import { FoodBankController } from './food-bank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoodBank } from './entities/food-bank.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([FoodBank]), forwardRef(() => AuthModule)],
  controllers: [FoodBankController],
  providers: [FoodBankService],
  exports: [FoodBankService],
})
export class FoodBankModule {}
