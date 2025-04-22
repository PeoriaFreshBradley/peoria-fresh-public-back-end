import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JWTPayload, TokenService } from '../token.service';

// this is a guard that we use to check if the user is authenticated and we add the user object to the request so we can access it in the controller
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly tokenService: TokenService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const accessToken = TokenService.getAccessTokenFromRequest(request);

    if (accessToken && this.tokenService.isValidToken(accessToken)) {
      const payload: JWTPayload = this.tokenService.verify(accessToken);
      request.user = payload; // set user object on request so we can access it in controller
      return true;
    }

    return false;
  }
}
