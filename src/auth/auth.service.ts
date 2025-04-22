import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { Request, Response } from 'express';
import { createTransport } from 'nodemailer';
import { Gardener } from 'src/gardener/entities/gardener.entity';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JWTPayload, TokenService } from './token.service';
import { FoodBankAdmin } from 'src/food-bank-admin/entities/food-bank-admin.entity';

@Injectable()
export class AuthService {
  transporter: any;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
  ) {
    // send email with link to reset password
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  async register(
    body: RegisterDto,
    response: Response,
  ): Promise<AuthenticatedPayload> {
    const newUser = await this.userService.create(
      this.convertRegisterDtoToUserDto(body),
    );

    // remove password from user object
    delete newUser.password;

    this.tokenService.createRefreshToken(newUser, response);
    return {
      accessToken: this.tokenService.createAccessToken(newUser),
      user: newUser,
      expiry: new Date().getTime() + (parseInt(process.env.JWT_EXPIRATION) * 1000)
    };
  }


  async registerAdmin(
    body: RegisterDto,
    response: Response,
  ): Promise<AuthenticatedPayload> {
    const newUser = await this.userService.create(
      this.convertRegisterDtoToUserDto(body),
    );

    // remove password from user object
    delete newUser.password;

    this.tokenService.createRefreshToken(newUser, response);
    return {
      accessToken: this.tokenService.createAccessToken(newUser),
      user: newUser,
      expiry: new Date().getTime() + (parseInt(process.env.JWT_EXPIRATION) * 1000)
    };
  }

  async login(
    body: LoginDto,
    request: Request,
    response: Response,
  ): Promise<AuthenticatedPayload> {
    const user = await this.userService.findOneByEmail(body.email, true);
    if (!user) {
      throw new UnauthorizedException("Invalid credentials");
    }

    const isPasswordCorrect = await bcrypt.compare(
      body.password,
      user.password,
    );
    if (!isPasswordCorrect) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // remove password from user object
    delete user.password;

    // get previous refresh token from request so we can mark it as replaced
    try {
      const prevRefreshToken = await TokenService.getRefreshTokenFromRequest(
        request,
      );
      await this.tokenService.markAsReplaced(prevRefreshToken);
    } catch (e) {
      // no previous refresh token
    }

    this.tokenService.createRefreshToken(user, response);
    return {
      accessToken: this.tokenService.createAccessToken(user), // pass previous refresh token so we can mark it as replaced
      user,
      expiry: new Date().getTime() + (parseInt(process.env.JWT_EXPIRATION) * 1000)
    };
  }

  async refresh(request: Request, response: Response) {
    // get refresh token from request
    const refreshToken = TokenService.getRefreshTokenFromRequest(request);
    if (this.tokenService.isValidToken(refreshToken)) {
      const payload: JWTPayload = this.tokenService.verify(refreshToken);
      const user = await this.userService.findOne(payload.id);
      if (!user) {
        throw new UnauthorizedException("User doesn't exist");
      }

      // user exists and token is not expired, so we can create new refresh token
      await this.tokenService.updateRefreshToken(user, refreshToken, response);

      return {
        accessToken: this.tokenService.createAccessToken(user),
        user,
      };
    }
    throw new UnauthorizedException('Invalid refresh token');
  }

  async requestPasswordReset(email: string) {
    const user = await this.userService.findOneByEmail(email, true);
    if (!user) {
      throw new UnauthorizedException("User doesn't exist");
    }

    // set password request reseet date
    await this.userService.update(user.id, {
      resetPasswordRequestDate: new Date(),
    });

    const hash = createHash('sha256').update(user.password).digest('hex');

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: 'Reset Password',
      // html: `<p>Click <a href="${process.env.FE_URL}/reset-password/${user.id}/${hash}">here</a> to reset your password</p>`,
      html: `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml">
      ​
      <body style = "background-color: #fff6ee;
                      color: #51545E;">
          <span style = "width: 100% !important;
                height: 100%;
                margin: 0;
                -webkit-text-size-adjust: none;
                font-family: Helvetica, Arial, sans-serif;
                background-color: #fff6ee;
                color: #51545E;">
              <span style = "display: none !important;
                    visibility: hidden;
                    mso-hide: all;
                    font-size: 1px;
                    line-height: 1px;
                    max-height: 0;
                    max-width: 0;
                    opacity: 0;
                    overflow: hidden;">
                  Use this link to reset your password. The link is only valid for 1 hour.
              </span>
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
                              style = "width: 100%;
                                        margin: 0;
                                        padding: 0;
                                        -premailer-width: 100%;
                                        -premailer-cellpadding: 0;
                                        -premailer-cellspacing: 0;">
                              <tr>
                                  <td style = "padding: 25px 0;
                                              text-align: center;">
                                      <a href="https://peoriafresh.org">
                                          <img src="https://storage.googleapis.com/pfresh-assets/images/emailBanner.png" alt="PeoriaFresh Banner" width="350" height="130">
                                      </a>
                                  </td>
                              </tr>
                              <!-- Email Body -->
                              <tr>
                                  <td width="570" cellpadding="0" cellspacing="0">
                                      <table align="center" width="570" cellpadding="0" cellspacing="0" role="presentation"
                                      style = "width: 570px;
                                                margin: 0 auto;
                                                padding: 0;
                                                -premailer-width: 570px;
                                                -premailer-cellpadding: 0;
                                                -premailer-cellspacing: 0;
                                                background-color: #FFFFFF;">
                                          <!-- Body content -->
                                          <tr>
                                              <td style = "padding: 45px;">
                                                  <div>
                                                      <span style = "margin-top: 0;
                                                                    color: #000000;
                                                                    font-size: 22px;
                                                                    font-weight: bold;
                                                                    text-align: left;">
                                                          Forgot your password?
                                                      </span>
                                                      <div style = "margin: .4em 0 1.1875em;">
                                                          <span style = "font-size: 16px; 
                                                                         line-height: 1.625;
                                                                         color: #202d2b;"    
                                                          >
                                                              Your email address was recently used to request a password reset for your PeoriaFresh account.
                                                              If this was you, you can use the button below to reset it.
                                                              <strong>This password reset is only valid for the next hour.</strong>
                                                          </span>
                                                      </div>
      ​
                                                       <!-- Action -->
                                                          <table align="center" width="100%" cellpadding="0" cellspacing="0" role="presentation"
                                                                 style = "width: 100%;
                                                                    margin: 0px auto;
                                                                    padding: 0;
                                                                    -premailer-width: 100%;
                                                                    -premailer-cellpadding: 0;
                                                                    -premailer-cellspacing: 0;
                                                                    text-align: center;">
                                                              <tr>
                                                                  <td align="center">
                                                                      <!-- Border based button
                                                   https://litmus.com/blog/a-guide-to-bulletproof-buttons-in-email-design -->
                                                                      <table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation">
                                                                          <tr>
                                                                              <td align="center">
                                                                                  <a href="${process.env.FE_URL}/reset-password/${user.id}/${hash}"  target="_blank">
                                                                                      <span style = " background-color: #202d2b;
                                                                                                    border-top: 10px solid #202d2b;
                                                                                                    border-right: 18px solid #202d2b;
                                                                                                    border-bottom: 10px solid #202d2b;
                                                                                                    border-left: 18px solid #202d2b;
                                                                                                    display: inline-block;
                                                                                                    color: #fffbf8;
                                                                                                    text-decoration: none;
                                                                                                    border-radius: 3px;
                                                                                                    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.25);
                                                                                                    -webkit-text-size-adjust: none;
                                                                                                    box-sizing: border-box;">
                                                                                          <strong>Reset your password</strong>
                                                                                      </span>
                                                                                  </a>
                                                                              </td>
                                                                          </tr>
                                                                      </table>
                                                                  </td>
                                                              </tr>
                                                          </table>
                                                      <div style = "margin: .4em 0 1.1875em;
                                                            font-size: 16px;
                                                            color: #202d2b;
                                                            line-height: 1.625;">
                                                      <p>If you did not request a password reset, please ignore this email.</p>
                                                      <p>Thank you!
                                                          <br><strong>PeoriaFresh team</strong></p>
                                                      </div>
                                                      <!-- Sub copy -->
                                                      <table role="presentation"
                                                      style = "margin-top: 25px;
                                                        padding-top: 25px;
                                                        border-top: 1px solid #EAEAEC;">
                                                          <tr style = "font-size: 13px;">
                                                              <td>
                                                                  If the button above doesn't work, copy and paste the following URL into your browser:
                                                                  <div style = "margin: .4em 0 1.1875em;">
                                                                  ${process.env.FE_URL}/reset-password/${user.id}/${hash}
                                                                  </div>
                                                              </td>
                                                          </tr>
                                                      </table>
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
          </span>
      </body>
      </html>`,
    };

    this.transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }

      return info.response;
    });
  }

  async resetPassword(userId: number, hash: string, password: string) {
    if (!userId || !hash || !password) {
      throw new BadRequestException('Invalid request');
    }

    const user = await this.userService.findOne(userId, true);
    if (!user) {
      throw new BadRequestException("User doesn't exist");
    }

    if (user.resetPasswordRequestDate == null) {
      throw new BadRequestException('Password reset request does not exist');
    }

    // check if password reset request is older than 1 hour
    const now = new Date();
    const diff = now.getTime() - user.resetPasswordRequestDate.getTime();
    if (diff > 3600000) {
      throw new BadRequestException('Password reset request expired');
    }

    const checkHash = createHash('sha256').update(user.password).digest('hex');
    if (checkHash !== hash) {
      throw new UnauthorizedException('Invalid request');
    }

    await this.userService.update(userId, {
      password,
      resetPasswordRequestDate: null,
    });

    return true;
  }

  private convertRegisterDtoToUserDto(body: RegisterDto): CreateUserDto {
    if (body.type == 'gardener') {
      return {
        email: body.email,
        password: body.password,
        gardenerProfile: body.profile as Gardener,
      };
    } else {
      return {
        email: body.email,
        password: body.password,
        foodBankProfile: body.profile as FoodBankAdmin,
      };
    }
  }
}

export interface AuthenticatedPayload {
  accessToken: string;
  user: User;
  expiry: number;
}
