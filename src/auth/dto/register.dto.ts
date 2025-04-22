import { IsEmail, IsNotEmpty } from 'class-validator';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';
import { Gardener } from 'src/gardener/entities/gardener.entity';

export class RegisterDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  password: string;
  @IsNotEmpty()
  confirmPassword: string;

  type: 'gardener' | 'food-bank';
  profile: Gardener | FoodBankAdmin;
  invitationCode?: string;
}
