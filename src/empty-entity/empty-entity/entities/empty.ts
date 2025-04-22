import {
  IsArray,
  IsBoolean,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';

// you need to import the entities you have relationships with
// import { Request } from 'src/request/entities/request.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Empty extends BaseEntity {
  // id, dateCreated, and dateModified come from BaseEntity, so no need to put them in here explicitly
  count: number;
}
