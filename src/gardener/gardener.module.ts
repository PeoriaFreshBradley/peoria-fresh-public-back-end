import { forwardRef, Module } from '@nestjs/common';
import { GardenerService } from './gardener.service';
import { GardenerController } from './gardener.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Gardener } from './entities/gardener.entity';
import { AuthModule } from 'src/auth/auth.module';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { RequestRepository } from 'src/request/request.repository';
import { GrowingRepository } from 'src/growing/growing.repository';
import { DeliveryRepository } from 'src/delivery/delivery.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Gardener]), forwardRef(() => AuthModule)],
  controllers: [GardenerController],
  providers: [GardenerService, ExtraProduceQueryAction, RequestRepository, GrowingRepository, DeliveryRepository],
  exports: [GardenerService],
})
export class GardenerModule {}
