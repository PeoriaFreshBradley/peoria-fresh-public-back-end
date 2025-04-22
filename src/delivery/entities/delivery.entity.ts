import {
  IsBoolean,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { Gardener } from 'src/gardener/entities/gardener.entity';
import { Location } from 'src/location/entities/location.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';

enum TypeEnum {
  donated,
  grown
};

@Entity()
export class Delivery extends BaseEntity {
  @Column()
  @IsNumber()
  amount: number;

  @Column()
  @IsDate()
  expectedDeliveryDate: Date;

  @Column()
  @IsNumber()
  verifiedAmount?: number;

  @Column({ default: false })
  @IsOptional()
  @IsBoolean()
  isVerified?: boolean;

  @ManyToOne(() => Produce, (produce) => produce.deliveries)
  @IsNotEmpty()
  @IsObject()
  produce: Produce;

  @ManyToOne(() => Location, (location) => location.deliveries)
  @IsNotEmpty()
  @IsObject()
  location: Location;

  @ManyToOne(() => Gardener, (user) => user.deliveries)
  @IsNotEmpty()
  @IsObject()
  provider: Gardener;

  @ManyToOne(() => FoodBankAdmin, (fba) => fba.verifiedDeliveries)
  @IsNotEmpty()
  @IsObject()
  verifiedBy: Delivery;

  @Column()
  @IsEnum(TypeEnum)
  type: string;
}