import {
  IsInt,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { TeamUser } from 'src/teamuser/entities/teamuser.entity';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity()
export class Team extends BaseEntity {
  @Column()
  @IsString()
  teamname: string;

  @Column()
  @IsNumber()
  totalscore: number;

  @OneToMany(() => TeamUser, (teamuser) => teamuser.teamId)
  @IsObject()
  teamusers: TeamUser[];

}