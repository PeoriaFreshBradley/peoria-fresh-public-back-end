import {
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Team } from 'src/team/entities/team.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class TeamUser extends BaseEntity {
  @Column()
  @IsNumber()
  teamId: number;

  @Column()
  @IsNumber()
  userId: number;

  @Column()
  @IsString()
  @IsOptional()
  teamUserName: string;

  @ManyToOne(() => Team, (team) => team.id)
  @IsObject()
  team: Team[];

  @ManyToOne(() => User, (user) => user.id)
  @IsObject()
  user: User[];

}
