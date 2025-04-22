import {
  IsDateString,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Gardener } from 'src/gardener/entities/gardener.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { Column, Entity, ManyToOne } from 'typeorm';


// Omit<Type, Property> makes the compiler construct the Type without a required property called Property
// Partial<Type> makes the compiler construct the Type with any or none of the required properties
//    for example, the following code is legal with Partial<> applied:
/*
var newGrowingToDeliveryTransition = {
  city: "Chicago"
} as Partial<GrowingToDeliveryTranstion>;
*/
// While the code is not valid if you had used:
/*
var newGrowingToDeliveryTransition = {
  city: "Chicago"
} as GrowingToDeliveryTranstion;
*/
// Aka NOT using Partial<>

export class GrowingToDeliveryTranstion {
  expectedDeliveryDate: Date;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  amountHarvested: number;
}

@Entity()
export class Growing extends BaseEntity {
  @Column()
  @IsNumber()
  amount: number;
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  expectedHarvest?: Date;
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  plantingDate?: Date;
  @Column({
    nullable: true,
  })
  @IsOptional()
  @IsDateString()
  deliveryDate?: Date;

  @Column('enum', {
    enum: ['accepted', 'planted', 'harvested', 'delivered'],
    default: 'accepted',
  })
  @IsOptional()
  @IsString()
  status: string;

  @ManyToOne(() => Gardener, (gardener) => gardener.growings)
  @IsOptional()
  @IsObject()
  gardener: Gardener;

  @ManyToOne(() => Produce, (produce) => produce.growings)
  @IsObject()
  produce: Produce;

  @IsOptional()
  toDelivery: GrowingToDeliveryTranstion;
}

