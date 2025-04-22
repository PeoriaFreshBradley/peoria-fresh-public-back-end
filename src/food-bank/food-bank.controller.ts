import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FoodBank } from './entities/food-bank.entity';
import { FoodBankService } from './food-bank.service';

@Controller('food-banks')
@ApiTags('Food Banks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseCustomValidationPipes(FoodBank)
export class FoodBankController extends BaseController<FoodBank> {
  constructor(protected service: FoodBankService) {
    super(service);
  }

  // only system admins can delete gardeners from the API, and for the moment, well keep gardener profiles private
  override userAbilities: UserAbilities<FoodBank> = {
    create: () => false, // food bank profiles should only be created by the system
    readOne: (user, data) =>
      user.type.foodBankProfile && user.type.foodBankProfile.id === data.id,
    update: (user, data) =>
      user.type.foodBankProfile && user.type.foodBankProfile.id === data.id,
    delete: (user, data) =>
      user.type.foodBankProfile && user.type.foodBankProfile.id === data.id,
  };
}
