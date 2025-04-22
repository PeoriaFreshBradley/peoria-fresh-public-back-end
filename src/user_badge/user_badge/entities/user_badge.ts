import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsObject
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Badge } from 'src/badge/badge/entities/badge';
import { Gardener } from 'src/gardener/entities/gardener.entity';

// you need to import the entities you have relationships with
// import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, OneToMany, ManyToOne, OneToOne, CreateDateColumn } from 'typeorm';

@Entity()
export class User_badge extends BaseEntity {
  // id, dateCreated, and dateModified come from BaseEntity, so no need to put them in here explicitly
  count: number;
  
  @ManyToOne(() => Gardener, (gardener) => gardener.id)
  @IsOptional()
  @IsObject()
  gardener: Gardener;

  @OneToOne(() => Badge, (badge) => badge.id)
  @IsOptional()
  @IsObject()
  badge: Badge;

  @Column()
  @IsNumber()
  gardenerId: number;

  @Column()
  @IsNumber()
  badgeId: number;

}