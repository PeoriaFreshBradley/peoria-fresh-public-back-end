import {
  Body,
  Controller,
  Post,
  Request as RequestDecorator,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { Request } from './entities/request.entity';
import { RequestService } from './request.service';

@Controller('requests')
@ApiTags('Request')
@UseCustomValidationPipes(Request)
export class RequestController extends BaseController<Request> {
  constructor(protected service: RequestService) {
    super(service, true);
  }

  @Post()
  create(@Body() data: Request, @RequestDecorator() { user }) {
    return this.service.create(data);
  }
}
