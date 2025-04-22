import { HttpModule } from '@nestjs/axios';
import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { Empty } from './entities/empty';
import { EmptyController } from './empty.controller';
import { ExtraProduceQueryAction } from 'src/otherlogic/fancyQueryProduce';
import { RequestRepository } from 'src/request/request.repository';
import { GrowingRepository } from 'src/growing/growing.repository';
import { DeliveryRepository } from 'src/delivery/delivery.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Empty]),
    forwardRef(() => AuthModule),
    HttpModule,
    // forwardRef(() => DeliveryModule) this is where you import dependent modules that you have 
  ],
  controllers: [EmptyController],
  providers: [Empty, ExtraProduceQueryAction, RequestRepository, GrowingRepository, DeliveryRepository],
  exports: [Empty],
})
export class EmptyModule {}
