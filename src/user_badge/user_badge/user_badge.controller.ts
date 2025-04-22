import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { User_badge } from './entities/user_badge';
import { User_badgeService } from './user_badge.service';

@Controller('userbadges')
@ApiTags('Userbadges')
@UseCustomValidationPipes(User_badge)
export class User_badgeController extends BaseController<User_badge> {
  constructor(protected service: User_badgeService) {
    super(service, true);
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

  override userAbilities: UserAbilities<User_badge> = {
    update: () => false,
    delete: () => false,
  };
}
