import { IsBoolean, IsEnum, IsNumber, IsObject, IsOptional, IsString, isString } from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { Growing } from 'src/growing/entities/growing.entity';
import { User } from 'src/user/entities/user.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

enum PubPrivEnum {
  public,
  private
};

@Entity()
export class Gardener extends BaseEntity {
  //Name
  @Column()
  @IsString()
  name: string;

  //Is this what they're growing currently or what they have grown
  @OneToMany(() => Growing, (growing) => growing.gardener)
  growings: Growing[];

  //What is this?
  @OneToOne(() => User, (user) => user.gardenerProfile)
  @IsOptional()
  @IsObject()
  user?: User;

  //What is this?
  @Column()
  @IsBoolean()
  hasGarden: boolean;

  //What deliveries have they made
  @OneToMany(() => Delivery, (delivery) => delivery.provider)
  @IsObject()
  deliveries: Delivery[];

  //Public or Private
  @Column()
  @IsEnum(PubPrivEnum)
  visibility: string;

  @Column()
  @IsString()
  bio: string;

  //Is meant to show if the player is part of the game (aka leaderboard) or not. 1 = they are a player, 0 = they are not a player
  @Column()
  @IsBoolean()
  isPlayer: boolean;


}
