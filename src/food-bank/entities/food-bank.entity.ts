import {
  IsObject,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUrl,
} from 'class-validator';
import { BaseEntity } from 'src/abstraction/base.entity';
import { User } from 'src/user/entities/user.entity';
import { Location } from 'src/location/entities/location.entity';
import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';

@Entity()
export class FoodBank extends BaseEntity {
  @Column()
  @IsString()
  name: string;
  @Column()
  @IsString()
  address: string;
  @Column()
  @IsString()
  city: string;
  @Column()
  @IsString()
  state: string;
  @Column()
  @IsString()
  zip: string;

  @Column()
  @IsString()
  growingZone: string;

  @Column()
  @IsPhoneNumber('US')
  phone: string;
  @Column()
  @IsUrl()
  website: string;

  @Column()
  @IsString()
  hours: string;

  @OneToOne(() => Location)
  @JoinColumn()
  @IsObject()
  location?: Location;

  @OneToMany(() => FoodBankAdmin, (fba) => fba.foodBank)
  foodBankAdmins: FoodBankAdmin[];
}
