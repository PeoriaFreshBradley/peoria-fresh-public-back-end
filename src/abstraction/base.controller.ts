import {
  Body,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UnauthorizedException,
} from '@nestjs/common';
import { UserAction } from 'src/auth/enum/user-action.enum';
import { JWTPayload } from 'src/auth/token.service';
import { BaseEntity } from './base.entity';
import { BaseService } from './base.service';

export class BaseController<T extends BaseEntity> {
  constructor(protected service: BaseService<T>, isUnprotected:boolean = false) {
    this.unProtected = isUnprotected
  }

  protected userAbilities?: UserAbilities<T>;
  private unProtected = false;

  // used create a new resource
  @Post()
  async create(@Body() data: T, @Request() { user }) {
    // checks to see if the user is allowed to create a new resource
    await this.checkUserAbilities(user, UserAction.Create, data);
    return this.service.create(data);
  }

  @Get()
  async findAll(@Query() query = {}, @Request() { user }) {
    // parse query for any json strings
    Object.keys(query).forEach((key) => {
      try {
        query[key] = JSON.parse(query[key]);
      } catch (e) {}
    });

    const all = await this.service.findAll(query);
    // need to have the resources befor we can check if the user is allowed to read them
    // SPEED IMPROVEMENT: Change the checkUserAbilities function to take a type argument and
    //    then the user action. There's got to be a way to check if they have permissions before
    //    actually taking the time to get it out of the database then to just reject them.
    await this.checkUserAbilities(user, UserAction.ReadAll, all);

    return all;
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @Request() { user }) {
    const toGet = await this.service.findOne(+id);
    // need to have the resource before we can check if the user is allowed to read it
    await this.checkUserAbilities(user, UserAction.ReadOne, toGet);

    return this.service.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updates: Partial<T>,
    @Request() { user },
  ) {
    const toUpdate = await this.service.findOne(+id);
    // need to have the resource before we can check if the user is allowed to update it
    await this.checkUserAbilities(user, UserAction.Update, toUpdate);

    return this.service.update(+id, updates);
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Request() { user }) {
    const toDelete = await this.service.findOne(+id);
    // need to have the resource before we can check if the user is allowed to delete it
    await this.checkUserAbilities(user, UserAction.Delete, toDelete);

    return this.service.remove(+id);
  }

  // checks to see if the user is allowed to perform the action by checking the rules from the userAbilities object which is overridden in the child class
  protected async checkUserAbilities(
    user: JWTPayload,
    action: UserAction,
    data: T | T[] | any,
  ) {
    if (this.unProtected) return;
    if (user.isSysAdmin) return;
    if (
      this.userAbilities?.[action] &&
      !(await(this.userAbilities[action](user, data)))
    ) {
      throw new UnauthorizedException(
        'You are not authorized to perform this action.',
      );
    }
  }
}

export interface UserAbilities<T extends BaseEntity> {
  create?: (user: JWTPayload, dto: any) => boolean | Promise<boolean>;
  readOne?: (user: JWTPayload, resource: T) => boolean | Promise<boolean>;
  readAll?: (user: JWTPayload, resources: T[]) => boolean | Promise<boolean>;
  update?: (user: JWTPayload, resource: T) => boolean | Promise<boolean>;
  delete?: (user: JWTPayload, resource: T) => boolean | Promise<boolean>;
}
