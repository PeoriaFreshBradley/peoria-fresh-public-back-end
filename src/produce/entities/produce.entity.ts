import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { ProduceName } from 'src/produce-name/entities/produce-name.entity';
import { Request } from 'src/request/entities/request.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { Growing } from 'src/growing/entities/growing.entity';

@Entity()
export class Produce extends BaseEntity {
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  smallPhotoURL: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  largePhotoURL: string;

  @Column()
  @IsString()
  name: string;
  @Column('text', { nullable: true })
  @IsOptional()
  @IsString()
  description: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  type: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  difficulty: string;
  //We cut this, originally we were going to have an equation to calculate the score multiplier, we just calculated it and then added it
  //@Column({ nullable: true })
  //@IsOptional()
  //@IsNumber()
  //weeks: number;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  growingZone: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  season: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  harvestStart: string;
  @Column({ nullable: true })
  @IsOptional()
  @IsString()
  harvestEnd: string;

  @Column('float', { nullable: true })
  @IsOptional()
  @IsNumber()
  unitMultiplier: number;

  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  priceForScoring: number;
  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  multiplierForScoring: number;
 /*  @Column({ nullable: true })
  @IsOptional()
  @IsNumber()
  /* daysToGrow: number; */ 

  @OneToMany(() => Delivery, (delivery) => delivery.produce)
  deliveries: Delivery[];
  @OneToMany(() => Request, (request) => request.produce)
  requests: Request[];

  @OneToMany(() => ProduceName, (produceName) => produceName.produce)
  @IsOptional()
  @IsArray()
  otherNames: ProduceName[];

  @OneToMany(() => Growing, (growing) => growing.produce)
  @IsArray()
  growings: Growing[];

  @Column({ default: true })
  @IsOptional()
  @IsBoolean()
  newFlag: boolean;

  @IsBoolean()
  isCommunityRequest: boolean;
}
