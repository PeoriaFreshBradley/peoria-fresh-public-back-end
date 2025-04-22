import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { FoodBankModule } from './food-bank/food-bank.module';
import { GardenerModule } from './gardener/gardener.module';
import { GrowingModule } from './growing/growing.module';
import { ProduceNameModule } from './produce-name/produce-name.module';
import { ProduceModule } from './produce/produce.module';
import { RequestModule } from './request/request.module';
import { DeliveryModule } from './delivery/delivery.module';
import { LocationModule } from './location/location.module';
import { UserModule } from './user/user.module';
import { FoodBankAdminModule } from './food-bank-admin/food-bank-admin.module';
import { EmptyModule } from './empty-entity/empty-entity/empty.module';
import { TeamModule } from './team/team.module';
import { TeamUserModule } from './teamuser/teamuser.module';
import { BadgeModule } from './badge/badge/badge.module';
import { User_BadgeModule } from './user_badge/user_badge/user_badge.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        autoLoadEntities: true,
        migrations: ['dist/migrations/*.js'],
        migrationsRun: true,
        // synchronize: true,
      }),
    }),
    ScheduleModule.forRoot(),
    RequestModule,
    ProduceModule,
    FoodBankModule,
    LocationModule,
    DeliveryModule,
    GardenerModule,
    GrowingModule,
    UserModule,
    AuthModule,
    ProduceNameModule,
    FoodBankAdminModule,
    BadgeModule,
    User_BadgeModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
