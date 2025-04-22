import {
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { FoodBank } from 'src/food-bank/entities/food-bank.entity';
import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Location extends BaseEntity {
  @Column()
  @IsString()
  address: string;

  @Column()
  @IsString()
  city: string;

  @Column()
  @IsString()
  state: string;

  @Column()
  @IsString()
  country: string;

  @Column()
  @IsNumber()
  postal: number;

  @OneToMany(() => Delivery, (delivery) => delivery.location)
  @IsObject()
  deliveries: Delivery[];

  @OneToMany(() => Request, (request) => request.location)
  @IsObject()
  requestLocations: Location[];

  @OneToOne(() => FoodBank)
  @IsObject()
  foodBank?: FoodBank;
}

export function locationAsStr(l: Location) {
    if (l === undefined) return undefined;
    return l.address + ", " + l.city + ", " + l.state + ", " + l.postal + ", " + l.country;
}