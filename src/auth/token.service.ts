import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Cron } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Request, Response } from 'express';
import { SignOptions } from 'jsonwebtoken';
import { DateTime } from 'luxon';
import { User } from 'src/user/entities/user.entity';
import { LessThan, Repository, UpdateResult } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';

export class TokenService extends JwtService {
  // final
  static readonly REFRESH_TOKEN_COOKIE_NAME = 'peoria-fresh-refresh-token';

  constructor(
    @InjectRepository(RefreshToken)
    private repository: Repository<RefreshToken>,
  ) {
    super({
      secret: process.env.JWT_SECRET,
    });
  }

  private save(token: string, expiration: Date): Promise<RefreshToken> {
    return this.repository.save({ token, expiresAt: expiration });
  }

  private find(token: string): Promise<RefreshToken> {
    return this.repository.findOne({
      where: { token },
    });
  }

  markAsReplaced(token: string): Promise<UpdateResult> {
    return this.repository.update({ token }, { replacedAt: new Date() });
  }

  isValidToken(token: string): boolean {
    try {
      return !!this.verify(token);
    } catch (e) {
      return false;
    }
  }

  createAccessToken(user: User): string {
    return this.sign(
      {
        id: user.id,
        email: user.email,
        type: {
          gardenerProfile: user.gardenerProfile ? {
            id: user.gardenerProfile?.id
          }: null,
          foodBankProfile: user.foodBankProfile ? {
            id: user.foodBankProfile?.id,
            foodBankId: user.foodBankProfile?.foodBank?.id
          }: null
        },
        profileId: user.foodBankProfile?.id || user.gardenerProfile?.id,
        isSysAdmin: user.isSystemAdmin,
      },
      { expiresIn: parseInt(process.env.JWT_EXPIRATION) },
    );
  }

  createRefreshToken(user: User, response: Response): string {
    const newRefreshToken = this.sign(
      {
        id: user.id,
        email: user.email,
        type: {
          gardenerProfile: user.gardenerProfile ? {
            id: user.gardenerProfile?.id
          }: null,
          foodBankProfile: user.foodBankProfile ? {
            id: user.foodBankProfile?.id,
            foodBankId: user.foodBankProfile?.foodBank?.id
          }: null
        },
        profileId: user.foodBankProfile?.id || user.gardenerProfile?.id,
        isSysAdmin: user.isSystemAdmin,
      },
      { expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION) },
    );

    // save refresh token to db
    const expiresAt = DateTime.now().plus({
      milliseconds: parseInt(process.env.JWT_REFRESH_EXPIRATION),
    });
    this.save(newRefreshToken, expiresAt.toJSDate());

    // set refresh token cookie
    response.cookie(TokenService.REFRESH_TOKEN_COOKIE_NAME, newRefreshToken, {
      httpOnly: true,
      path: '/auth/refresh',
    });
    return newRefreshToken;
  }

  async updateRefreshToken(
    user: User,
    currentRefreshToken: string,
    response: Response,
  ): Promise<string> {
    const existsInDb = await this.find(currentRefreshToken);
    if (
      !currentRefreshToken ||
      !this.isValidToken(currentRefreshToken) ||
      !existsInDb // this confirms that the token has not been revoked
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (existsInDb.replacedAt) {
      // this likely means the refresh token has been stolen
      throw new UnauthorizedException('Refresh token has been replaced');
    }

    // mark the current refresh token as replaced
    await this.markAsReplaced(currentRefreshToken);

    return this.createRefreshToken(user, response);
  }

  static getAccessTokenFromRequest(request: Request): string {
    const authHeader = request.headers['authorization'];
    if (!authHeader) {
      throw new UnauthorizedException('Invalid authorization header');
    }
    const [_, token] = authHeader.split(' ');
    return token;
  }

  static getRefreshTokenFromRequest(request: Request): string {
    const refreshToken =
      request.cookies[TokenService.REFRESH_TOKEN_COOKIE_NAME];
    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token');
    }
    return refreshToken;
  }

  override sign(payload: JWTPayload, options?: SignOptions) {
    return super.sign(payload, options);
  }

  @Cron(' 0 0 * * * *') // every hour
  async removeExpiredRefreshTokens() {
    const removed = await this.repository.delete({
      expiresAt: LessThan(new Date()),
    });

    console.log('Removed expired refresh tokens', removed);
  }
}


interface JWTUserTypes {
  gardenerProfile?: {
    id: number;
  };
  foodBankProfile?: {
    id: number;
    foodBankGrowingZone?: string;
    foodBankId: number;
  };
}

export interface JWTPayload {
  id: number;
  email: string;
  isSysAdmin: boolean;
  type: JWTUserTypes;
  profileId: number;
}
