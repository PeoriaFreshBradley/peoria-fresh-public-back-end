import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { TeamUser } from './entities/teamuser.entity';
import { TeamUserService } from './teamuser.service';

@Controller('teamusers')
@ApiTags('TeamUser')
@UseCustomValidationPipes(Request)
export class TeamUserController extends BaseController<TeamUser> {
  constructor(protected service: TeamUserService) {
    super(service, true);
  }

}

