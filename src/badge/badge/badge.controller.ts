import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { Badge } from './entities/badge';
import { BadgeService } from './badge.service';
import { AuthGuard } from 'src/auth/guards/auth.guard';

@Controller('badges')
@ApiTags('Badges')
@UseGuards(AuthGuard)
@UseCustomValidationPipes(Badge)
export class BadgeController extends BaseController<Badge> {
  constructor(protected service: BadgeService) {
    super(service, true);
  }

  @Get("/earned")
  async getEarned(@Request() { user }){
    return await this.service.findCompletedBadges(user.type.gardenerProfile.id);
  }

  @Get()
  override async findAll(@Query() query = {}, @Request() { user }) {
    // parse query for any json strings
    Object.keys(query).forEach((key) => {
      try {
        query[key] = JSON.parse(query[key]);
      } catch (e) {}
    });

    const all = await this.service.findAll(query);

    return all;
  }

  override userAbilities: UserAbilities<Badge> = {
    update: () => false,
    delete: () => false,
    create: () => false,
  };
}
