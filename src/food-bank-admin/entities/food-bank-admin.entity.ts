import {
  IsEmail,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { FoodBank } from 'src/food-bank/entities/food-bank.entity';
import { User } from 'src/user/entities/user.entity';
import { Delivery } from 'src/delivery/entities/delivery.entity';

@Entity()
export class FoodBankAdmin extends BaseEntity {
  @Column()
  @IsString()
  name: string;
 
  @ManyToOne(() => FoodBank, (fb) => fb.foodBankAdmins)
  @IsOptional()
  @IsObject()
  foodBank: FoodBank;

  @Column()
  @IsNumber()
  permission: number;

  @OneToOne(() => User, (user) => user.foodBankProfile)
  @IsOptional()
  @IsObject()
  user: User;

  @OneToMany(() => Delivery, (delivery) => delivery.verifiedBy)
  @IsObject()
  verifiedDeliveries: Delivery[];

  @Column()
  @IsString()
  invitationCode: string;

  @Column()
  @IsEmail()
  invitationEmail: string;
}
