import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ProduceName } from './entities/produce-name.entity';
import { ProduceNameService } from './produce-name.service';

@Controller('produce-names')
@ApiTags('Produce Names')
@UseGuards(AuthGuard)
@UseCustomValidationPipes(ProduceName)
export class ProduceNameController extends BaseController<ProduceName> {
  constructor(protected service: ProduceNameService) {
    super(service);
  }

  // only system admins can modify or delete produce names from the API after they are created
  override userAbilities: UserAbilities<ProduceName> = {
    update: () => false,
    delete: () => false,
  };
}
