import { Controller, Get, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { Produce } from './entities/produce.entity';
import { ProduceService } from './produce.service';

@Controller('produce')
@ApiTags('Produce')
@UseCustomValidationPipes(Produce)
export class ProduceController extends BaseController<Produce> {
  constructor(protected service: ProduceService) {
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

  // only system admins can modify or delete produce names from the API after they are created
  override userAbilities: UserAbilities<Produce> = {
    update: () => false,
    delete: () => false,
  };
}
