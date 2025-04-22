import { forwardRef, Module } from '@nestjs/common';
import { GrowingService } from './growing.service';
import { GrowingController } from './growing.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Growing } from './entities/growing.entity';
import { AuthModule } from 'src/auth/auth.module';
import { DeliveryModule } from 'src/delivery/delivery.module';
import { GardenerRepository } from 'src/gardener/gardener.repository';
import { RequestRepository } from 'src/request/request.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Growing]), forwardRef(() => AuthModule), forwardRef(() => DeliveryModule)],
  controllers: [GrowingController],
  providers: [GrowingService, GardenerRepository, RequestRepository],
})
export class GrowingModule {}
