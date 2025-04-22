import {
  BadRequestException,
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
  UseGuards
} from '@nestjs/common';
import { DeliveryService } from './delivery.service';
import { UserAbilities } from 'src/abstraction/base.controller';
import { Delivery } from 'src/delivery/entities/delivery.entity';
import { ApiTags } from '@nestjs/swagger';
import { GardenerRepository } from 'src/gardener/gardener.repository';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FoodBankAdminRepository } from 'src/food-bank-admin/food-bank-admin.repository';
import { UserRepository } from 'src/user/user.repository';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';

@Controller('deliveries')
@ApiTags('Deliveries')
@UseGuards(AuthGuard)
export class DeliveryController {
  constructor(
    protected service: DeliveryService,
    protected gardenerRepo: GardenerRepository,
    protected fbaRepo: FoodBankAdminRepository,
    protected userRepo: UserRepository
  ) {
  }

  protected userAbilities?: UserAbilities<Delivery>;

  // The delivery object should be internally managed. Not accessisble to update/delete from the API, only from actions on other objects.
  // we don't put the gardener ID in this call because a malicious user could fake it
  // We grab it out of the session variables
  @Post()
  async create(@Body() data: Omit<Delivery, 'id'>, @Request() { user }) {
    if (!user.type.gardenerProfile) {
      throw new ForbiddenException("Only gardeners can do this");
    }
    let provider = await this.gardenerRepo.findOne({
      where: {
        id: user.type.gardenerProfile.id
      }
    });
    data.provider = provider;
    data.type = 'donated';
    return this.service.create(data);
  }

  @Get()
  async findAll(@Query() query = {}, @Request() { user }) {
    query['limit'] = -1;
    Object.keys(query).forEach((key) => {
      try {
        query[key] = JSON.parse(query[key]);
      } catch (e) {}
    });
    var doGardener = false;
    var doAdmin = false;

    if (query['showAs']) {
      doGardener = (user.type.gardenerProfile && query['showAs'] === 'gardener');
      doAdmin = (user.type.foodBankProfile && query['showAs'] === 'food-bank-admin');

      if (doGardener === false && doAdmin === false) { // if someone is doing something nasty, revert to the default
        doGardener = !!user.type.gardenerProfile;
        doAdmin = !!user.type.foodBankProfile;
      }
    }
    else {
      doGardener = !!user.type.gardenerProfile;
      doAdmin = !!user.type.foodBankProfile;
    }
    delete query['showAs'];

    if (doGardener === true) {
        return this.service.getAllForUser(user.type.gardenerProfile.id, query);
    }
    else if (user.isSysAdmin || doAdmin === true) {
      const profile = await this.fbaRepo.findOne({
        where: {
          id: user.type.foodBankProfile.id
        },
        relations: ['foodBank', 'foodBank.location']
      });

      if (!profile.foodBank || !profile.foodBank.location) {
        throw new BadRequestException("Your food bank must have a linked location before you can view deliveries for that location.");
      }
      query['location.id'] = profile.foodBank.location.id;

      return this.service.getAll(query);
    }
  }

  @Patch(':id')
  async verifyDelivery(@Param('id') id: string, @Body() data: Partial<Delivery>, @Request() { user }) {
    if (!user.type.foodBankProfile) {
      throw new ForbiddenException("Only food bank admins can do this");
    }

    return this.service.verifyDelivery(+id, data.verifiedAmount, user.type.foodBankProfile as FoodBankAdmin);
  }
}