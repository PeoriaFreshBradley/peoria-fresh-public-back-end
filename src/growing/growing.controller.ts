import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { UserAction } from 'src/auth/enum/user-action.enum';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { Growing } from './entities/growing.entity';
import { GrowingService } from './growing.service';

@Controller('growing')
@ApiTags('Growing')
@UseGuards(AuthGuard)
@UseCustomValidationPipes(Growing)
export class GrowingController extends BaseController<Growing> {
  constructor(protected service: GrowingService) {
    super(service);
  }

  @Post()
  /**
   * Ensure that the Growing is getting attributed to the right Gardener.
   */
  override create(@Body() data: Growing, @Request() { user }) {
    this.checkUserAbilities(user, UserAction.Create, data);
    if (user.type.gardenerProfile)
      data.gardener = {
        id: user.type.gardenerProfile.id,
      } as any;
    return this.service.create(data);
  }

  /**
   * Ensure that Gardeners are only allowed to see their own Growings.
   */
  @Get()
  override async findAll(@Query() query = {}, @Request() { user }) {
    // parse query for any json strings
    Object.keys(query).forEach((key) => {
      try {
        query[key] = JSON.parse(query[key]);
      } catch (e) {}
    });

    // ensure only results pertaining to the requesting user are returned
    if (user.type.gardenerProfile) {
      query["gardener.id"] = user.type.gardenerProfile.id;
    }

    const all = await this.service.findAll(query);
    // need to have the resources befor we can check if the user is allowed to read them
    this.checkUserAbilities(user, UserAction.ReadAll, all);

    return all;
  }

  @Get(':id')
  override async findOne(@Param('id') id: string, @Request() { user }) {
    const toGet = await this.service.findOne(+id);
    // need to have the resource before we can check if the user is allowed to read it
    this.checkUserAbilities(user, UserAction.ReadOne, toGet);

    return this.service.findOne(+id);
  }

  override userAbilities: UserAbilities<Growing> = {
    update: (user, data) =>
      user.type.gardenerProfile && user.type.gardenerProfile.id === data.gardener.id,
    delete: (user, data) =>
      user.type.gardenerProfile && user.type.gardenerProfile.id === data.gardener.id,
  };
}
