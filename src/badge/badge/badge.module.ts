import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Badge } from './entities/badge';
import { BadgeController } from './badge.controller';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { RequestRepository } from 'src/request/request.repository';
import { GrowingRepository } from 'src/growing/growing.repository';
import { DeliveryRepository } from 'src/delivery/delivery.repository';
import { BadgeService } from './badge.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { ProduceNameModule } from 'src/produce-name/produce-name.module';
import { User_BadgeModule } from 'src/user_badge/user_badge/user_badge.module';
import { GardenerModule } from 'src/gardener/gardener.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Badge]),
    forwardRef(() => AuthModule),
    HttpModule,
    forwardRef(() => DeliveryModule), //this is where you import dependent modules that you have
    forwardRef(() => ProduceNameModule),
    forwardRef(() => User_BadgeModule),
    forwardRef(() => GardenerModule)
  ],
  controllers: [BadgeController],
  providers: [BadgeService, ExtraProduceQueryAction, RequestRepository, GrowingRepository, DeliveryRepository],
  exports: [BadgeService],
})
export class BadgeModule {}
