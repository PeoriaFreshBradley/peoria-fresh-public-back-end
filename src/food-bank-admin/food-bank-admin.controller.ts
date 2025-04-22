import { Body, Controller, Param, UnauthorizedException, UseGuards, Request, Patch, Get, Query, Post, ConflictException, BadRequestException, ForbiddenException, Delete, NotFoundException } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BaseController, UserAbilities } from 'src/abstraction/base.controller';
import { UseCustomValidationPipes } from 'src/abstraction/pipes/use-custom-validation-pipes.decorator';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { FoodBankAdmin } from './entities/food-bank-admin.entity';
import { FoodBankAdminService } from './food-bank-admin.service';
import { UserRepository } from 'src/user/user.repository';
import { FoodBankAdminRepository } from './food-bank-admin.repository';
import { UserAction } from 'src/auth/enum/user-action.enum';
import { createTransport } from 'nodemailer';
import { Request as PFRequest } from 'src/request/entities/request.entity';
import { Produce } from 'src/produce/entities/produce.entity';
import { RequestRepository } from 'src/request/request.repository';
import { Location as PFLocation } from 'src/location/entities/location.entity';

function generateId() {
  const alpha = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890_';
  let arr = new Array<string>();
  for (let i = 0; i < (Math.random() * 40) + 20; i++) {
    arr.push(alpha[Math.round((Math.random() * alpha.length))]);
  }
  return arr.join('');
}

interface miniReq {
  amount: number;
  produce: Produce;
}

@Controller('food-bank-admin')
@ApiTags('Food Banks')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@UseCustomValidationPipes(FoodBankAdmin)
export class FoodBankAdminController extends BaseController<FoodBankAdmin> {
  #transporter: any;
  constructor(
    protected service: FoodBankAdminService,
    protected userRepo: UserRepository,
    protected fbaRepo: FoodBankAdminRepository,
    protected requestRepo: RequestRepository
  ) {
    super(service);

    this.#transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  @Patch(':id')
  /**
   * Make sure the user isn't trying to do something they're supposed to. 
   * That's the main point of most of this logic.
   */
  override async update(
    @Param('id') id: string,
    @Body() updates: Partial<FoodBankAdmin>,
    @Request() { user },
  ) {
    const toUpdate = await this.service.findOne(+id);
    // need to have the resource before we can check if the user is allowed to update it
    await this.checkUserAbilities(user, UserAction.Update, toUpdate);

    if (user.type.foodBankProfile.id === parseInt(id)) {
      if ((updates.permission !== undefined || updates.permission !== null) || updates.foodBank) {
        throw new ForbiddenException("You can't change certain attributes about your own user. These are managed by your administrator.");
      }
    }
    else {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      if (profile.permission !== 0) {
        throw new ForbiddenException("You can't change this value with your current permission level. See your administrator.");
      }
      else if (profile.foodBank.id !== (await this.#lookupFBAProfile(parseInt(id))).foodBank.id) {
        throw new ForbiddenException("You can't change attributes of members of other organizations.");
      }
      else if (updates.foodBank) {
        throw new ForbiddenException("You can't change the organization membership of any user.");
      }
    }

    return this.service.update(+id, updates);
  }

  @Get()
  override async findAll(@Query() query = {}, @Request() { user }) {
    // parse query for any json strings
    Object.keys(query).forEach((key) => {
      try {
        query[key] = JSON.parse(query[key]);
      } catch (e) { }
    });

    const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);

    query['foodBank.id'] = profile.foodBank.id;

    const all = await this.service.findAll(query);
    // need to have the resources befor we can check if the user is allowed to read them
    await this.checkUserAbilities(user, UserAction.ReadAll, all);

    return all;
  }

  @Post()
  override async create(@Body() data: FoodBankAdmin, @Request() { user }) {
    await this.checkUserAbilities(user, UserAction.Create, data);

    const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);

    const newUser = data;
    data.foodBank = profile.foodBank;
    data.invitationCode = generateId();


    try {
      const newUserObject = await this.service.create(newUser);
      if (newUserObject === null) {
        throw new ConflictException("An admin with that email already exists");
      }

      const mailOptions = {
        from: process.env.EMAIL,
        to: newUser.invitationEmail,
        subject: 'PeoriaFresh! Invite',
        html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
        <html xmlns="http://www.w3.org/1999/xhtml">
        
        <body style="background-color: #fff6ee; 
                     color: #51545E;">
          <span style = "width: 100%;
                         height: 100%;
                         margin: 0;
                         -webkit-text-size-adjust: none;
                         font-family: Helvetica, Arial, sans-serif;
                         background-color: #fff6ee;
                        color: #51545E;">
            <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                    style = "width: 100%;
                    margin: 0;
                    padding: 0;
                    -premailer-width: 100%;
                    -premailer-cellpadding: 0;
                    -premailer-cellspacing: 0;
                    background-color: #fff6ee;">
              <tr>
                <td align="center">
                  <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
                          style="width: 100%;
                          margin: 0;
                        padding: 0;
                        -premailer-width: 100%;
                        -premailer-cellpadding: 0;
                        -premailer-cellspacing: 0;">
                    <!-- Picture Banner -->
                    <tr>
                      <td style = "padding: 25px 0; text-align: center;">
                        <a href="https://peoriafresh.org">
                            <img src="https://storage.googleapis.com/pfresh-assets/images/emailBanner.png" alt="PeoriaFresh Banner" width="350" height="130">
                        </a>
                      </td>
                    </tr>
                    <!-- Email Body -->
                    <tr>
                      <td width="570" cellspacing="0" cellmargin="0">
                        <table width="570" cellspacing="0" cellmargin="0" role="presentation"
                              style="width: 570px;
                                     margin: 0 auto;
                                     padding: 0;
                                     -premailer-width: 570px;
                                     -premailer-cellpadding: 0;
                                     -premailer-cellspacing: 0;
                                     background-color: #FFFFFF;">
                          <!-- Body Content -->         
                          <tr>
                            <td style="padding: 45px;">
                              <span style = "margin-top: 0;
                                              color: #000000;
                                              font-size: 22px;
                                              font-weight: bold;
                                              text-align: left;">
                                  Admin Account
                              </span>
                              <div style = "margin: .4em 0 1.1875em;">
                                <span style = "font-size: 16px; 
                                                line-height: 1.625;
                                                color: #202d2b;"    
                                >
                                You've been invited to join ${newUserObject.foodBank.name}'s organization. <strong> Click <a href="${process.env.FE_URL}/foodbank-admin-register/${newUserObject.id}/${newUserObject.invitationCode}">here</a> to create your Food Bank/Pantry admin account.</strong>
                                </span>
                              </div>
                              <div style = "margin: .4em 0 1.1875em;
                                            font-size: 16px;
                                            color: #202d2b;
                                            line-height: 1.625;">
                                <p>If you do not belong to the organization listed, please ignore this email.</p>
                                <p>Thank you!<br><strong>PeoriaFresh team</strong></p>
                                </div>
                                <!-- Sub-Copy -->
                                <table role="presentation"
                                       style = "margin-top: 25px;
                                       padding-top: 25px;
                                       border-top: 1px solid #EAEAEC;">
                                  <tr style = "font-size: 13px;">
                                    <td>
                                        If the button above doesn't work, copy and paste the following URL into your browser:
                                        <div style = "margin: .4em 0 1.1875em;">
                                          ${process.env.FE_URL}/foodbank-admin-register/${newUserObject.id}/${newUserObject.invitationCode}
                                        </div>
                                    </td>
                                  </tr>
                                </table>
                            </td>
                          </tr>
                        </table>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </span>
        </body>
        </html>
        `,
      };


      this.#transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
        return info.response;
      });
      return newUserObject;
    }
    catch (e) {
      throw new ConflictException("An admin with that email already exists");
    }
  }

  @Post('request')
  /**
   * Food banks are allowed to directly request in pounds of food. They know the real scale of the need better than the patron view can convey. 
   */
  async fbaRequest(@Body() data: miniReq, @Request() { user }) {
    const requestingFoodbank = (await this.service.findOne(user.type.foodBankProfile.id));
    const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);

    if (!(profile.permission <= 1)) {
      throw new ForbiddenException("You do not have proper permissions to perform this action. See your administrator.");
    }

    if (!requestingFoodbank.foodBank.location) {
      throw new BadRequestException("You can't request food until your food bank or food pantry is associated with an address.");
    }

    return this.requestRepo.save({
      amount: data.amount,
      produce: data.produce,
      location: { id: requestingFoodbank.foodBank.location.id } as PFLocation,
      requestDate: new Date()
    } as PFRequest);
  }

  @Delete(':id')
  /**
   * Be sure that all of the deletion logic is correct. If you delete a user, there's no going back.
   */
  async rem(@Param('id') id: string, @Body() data, @Request() { user }) {
    if (!data.name) {
      throw new BadRequestException("You need to confirm this admin's removal from your organization by typing their name.");
    }


    if (+id === user.type.foodBankProfile.id) throw new ForbiddenException("You cannot delete yourself.");

    const targetAdmin = await this.service.findOne(+id);

    if (targetAdmin === null) throw new NotFoundException("That admin does not exist.");
    if (targetAdmin.foodBank === null) throw new ConflictException("This user is already removed from your organization.");

    await this.checkUserAbilities(user, UserAction.Delete, targetAdmin);

    if (targetAdmin.name === data.name) {
      const targetUser = await this.userRepo.findOne({
        where: {
          foodBankProfile: { id: targetAdmin.id }
        }
      });

      if (targetUser !== null)
        await this.userRepo.update(targetUser.id, {
          foodBankProfile: null
        });

      return this.service.update(+id, {
        name: `Removed Admin #${targetAdmin.id}`,
        foodBank: null,
        invitationCode: '',
        invitationEmail: `Removed Admin #${targetAdmin.id}`
      } as Partial<FoodBankAdmin>);
    }
    throw new BadRequestException("The name given and name of the target admin don't match.");
  }

  // All food bank admins can do everything to themselves, but to do things to others, you need special access
  override userAbilities: UserAbilities<FoodBankAdmin> = {
    create: async (user, data) => {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      return !!data && user.type.foodBankProfile && (profile.permission <= 1);
    },
    readOne: async (user, data) => {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      return !!data && user.type.foodBankProfile && ((user.type.foodBankProfile.id === data.id) || (profile.permission <= 1 && data.foodBank && data.foodBank.id === profile.foodBank.id));
    },
    update: async (user, data) => {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      return !!data && user.type.foodBankProfile && ((user.type.foodBankProfile.id === data.id) || (profile.permission === 0 && data.foodBank && data.foodBank.id === profile.foodBank.id));
    },
    delete: async (user, data) => {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      return !!data && user.type.foodBankProfile && (profile.permission === 0 && data.foodBank && data.foodBank.id === profile.foodBank.id);
    },
    readAll: async (user, data) => {
      const profile = await this.#lookupFBAProfile(user.type.foodBankProfile.id);
      return !!data && user.type.foodBankProfile && (profile.permission <= 1);
    },
  };

  async #lookupFBAProfile(profileId: number) {
    return await this.fbaRepo.findOne({
      where: {
        id: profileId
      },
      relations: ['foodBank']
    });
  }
}

