import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  Response,
  UsePipes,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthenticatedPayload, AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestPasswordResetDto } from './dto/request-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { RegisterPipe } from './pipes/register.pipe';
import { ResetPasswordPipe } from './pipes/reset-password.pipe';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @UsePipes(RegisterPipe)
  register(
    @Body() body: RegisterDto,
    @Response({
      passthrough: true,
    })
    res,
  ): Promise<AuthenticatedPayload> {
    return this.authService.register(body, res);
  }

  @Post('register-admin')
  @UsePipes(RegisterPipe)
  registerAdmin(
    @Body() body: RegisterDto,
    @Response({
      passthrough: true,
    })
    res,
  ): Promise<AuthenticatedPayload> {
    return this.authService.registerAdmin(body, res);
  }

  @Post('login')
  async login(
    @Body() body: LoginDto,
    @Request() req,
    @Response({
      passthrough: true,
    })
    res,
  ): Promise<AuthenticatedPayload> {
    return this.authService.login(body, req, res);
  }

  @Post('refresh')
  refresh(
    @Request() req,
    @Response({
      passthrough: true,
    })
    res,
  ) {
    return this.authService.refresh(req, res);
  }

  @Post('request-password-reset')
  requestPasswordReset(@Body() body: RequestPasswordResetDto) {
    return this.authService.requestPasswordReset(body.email);
  }

  @Post('reset-password/:id/:token')
  @UsePipes(ResetPasswordPipe)
  resetPassword(
    @Param('id') id: number,
    @Param('token') hash: string,
    @Body() body: ResetPasswordDto,
  ) {
    return this.authService.resetPassword(id, hash, body.password);
  }
}
