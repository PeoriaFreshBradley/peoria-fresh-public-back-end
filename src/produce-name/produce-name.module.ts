import { forwardRef, Module } from '@nestjs/common';
import { ProduceNameService } from './produce-name.service';
import { ProduceNameController } from './produce-name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { ProduceName } from './entities/produce-name.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProduceName]),
    forwardRef(() => AuthModule),
  ],
  controllers: [ProduceNameController],
  providers: [ProduceNameService],
  exports: [ProduceNameService],
})
export class ProduceNameModule {}
