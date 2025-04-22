import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
  IsObject
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';

// you need to import the entities you have relationships with
// import { Request } from 'src/request/entities/request.entity';
import { User_badge } from 'src/user_badge/user_badge/entities/user_badge';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity()
export class Badge extends BaseEntity {
  // id, dateCreated, and dateModified come from BaseEntity, so no need to put them in here explicitly
  count: number;

  @Column()
  @IsString()
  name: string;

  @Column()
  @IsString()
  description: string;

  @Column()
  @IsString()
  imageURL: string;

  @Column()
  @IsString()
  lockedImageURL: string;

  @Column()
  @IsString()
  badgeType: string;

  // @OneToOne(() => User_badge, (user_badge) => user_badge.id)
  // @IsOptional()
  // @IsObject()
  // userbadge?: User_badge;


}
