import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { Location } from 'src/location/entities/location.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity()
export class Request extends BaseEntity {
  @Column()
  @IsNumber()
  amount: number;

  @IsNumber()
  numPeople: number;

  @Column({ type: 'date' })
  @IsOptional()
  @IsDateString()
  requestDate: Date;

  @IsString()
  @IsOptional()
  requestFrom: string;

  @ManyToOne(() => Produce, (produce) => produce.requests)
  @IsNotEmpty()
  @IsObject()
  produce: Produce;

  @ManyToOne(() => Location, (location) => location.requestLocations)
  @IsObject()
  location?: Location;

}
