import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { User_badge } from './entities/user_badge';
import { User_badgeController } from './user_badge.controller';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { RequestRepository } from 'src/request/request.repository';
import { GrowingRepository } from 'src/growing/growing.repository';
import { DeliveryRepository } from 'src/delivery/delivery.repository';
import { User_badgeService } from './user_badge.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User_badge]),
    forwardRef(() => AuthModule),
    HttpModule,
    // forwardRef(() => DeliveryModule) this is where you import dependent modules that you have 
  ],
  controllers: [User_badgeController],
  providers: [User_badgeService, ExtraProduceQueryAction, RequestRepository, GrowingRepository, DeliveryRepository],
  exports: [User_badgeService],
})
export class User_BadgeModule {}
