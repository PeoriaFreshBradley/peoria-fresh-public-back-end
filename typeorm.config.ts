// for generating migrations from the cli

import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import { User } from 'src/user/entities/user.entity';
import { FoodBank } from 'src/food-bank/entities/food-bank.entity';
import { Gardener } from 'src/gardener/entities/gardener.entity';
import { Growing } from 'src/growing/entities/growing.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { ProduceName } from 'src/produce-name/entities/produce-name.entity';
import { Location } from 'src/location/entities/location.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';


config();

const configService = new ConfigService();

export default new DataSource({
  type: 'mysql',
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  username: configService.get('DB_USERNAME'),
  password: configService.get('DB_PASSWORD'),
  database: configService.get('DB_DATABASE'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/migrations/*{.ts,.js}'],
});
