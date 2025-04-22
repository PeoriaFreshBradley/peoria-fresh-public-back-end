import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProduceNameModule } from 'src/produce-name/produce-name.module';
import { Produce } from './entities/produce.entity';
import { ProduceController } from './produce.controller';
import { ProduceService } from './produce.service';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { RequestRepository } from 'src/request/request.repository';
import { GrowingRepository } from 'src/growing/growing.repository';
import { DeliveryRepository } from 'src/delivery/delivery.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Produce]),
    forwardRef(() => AuthModule),
    HttpModule,
    forwardRef(() => ProduceNameModule),
    forwardRef(() => DeliveryModule)
  ],
  controllers: [ProduceController],
  providers: [ProduceService, ExtraProduceQueryAction, RequestRepository, GrowingRepository, DeliveryRepository],
  exports: [ProduceService],
})
export class ProduceModule {}
