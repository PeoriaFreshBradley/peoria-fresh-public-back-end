import {
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { TeamService } from './team.service';
import { UserAbilities } from 'src/abstraction/base.controller';
import { ApiTags } from '@nestjs/swagger';

@Controller('team')
@ApiTags('Teams')
export class TeamController {
  constructor(protected service: TeamService) {
  }

  
}
