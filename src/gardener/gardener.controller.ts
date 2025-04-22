import { Controller, UseGuards, Get, Put, Patch, Param, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Gardener } from './entities/gardener.entity';
import { GardenerService } from './gardener.service';

@Controller('gardeners')
@ApiTags('Gardeners')
@UseGuards(AuthGuard)
@UseCustomValidationPipes(Gardener)
export class GardenerController extends BaseController<Gardener> {
  constructor(protected service: GardenerService) {
    super(service);
  }

  @Get('/leaderboard')
  async getLeaderboard(){
    let scoreboard = await this.service.getLeaderboard();
    return scoreboard;
  }


  // only system admins can delete gardeners from the API, and for the moment, well keep gardener profiles private
  override userAbilities: UserAbilities<Gardener> = {
    create: () => false, // gardener profiles should only be created by the system
    readAll: () => false,
    readOne: (user, data) => {
      return user.type.gardenerProfile && user.type.gardenerProfile.id === data.id;
    },
    update: (user, data) =>
      user.type.gardenerProfile && user.type.gardenerProfile.id === data.id,
    delete: (user, data) =>
      user.type.gardenerProfile && user.type.gardenerProfile.id === data.id,
  };
}
