import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { Empty } from './entities/empty';
import { EmptyService } from './empty.service';

@Controller('empty')
@ApiTags('Empty')
@UseCustomValidationPipes(Empty)
export class EmptyController extends BaseController<Empty> {
  constructor(protected service: EmptyService) {
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

  override userAbilities: UserAbilities<Empty> = {
    update: () => false,
    delete: () => false,
  };
}
