import {
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { UsersService } from 'src/users/users.service';

import { JwtPayload } from 'types/JwtPayload.interface';
import { TokenService } from '../services/token.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private tokensService: TokenService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJwtFromCookie,
      ]),
      passReqToCallback: true,
      secretOrKey: configService.get('TOKENS.JWT_KEY_REFRESH'),
    });
  }

  static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['refresh_token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  async validate(request: Request, payload: JwtPayload) {
    const refresh_token_from_request = request.cookies['refresh_token'];
    const user = await this.usersService.findById(payload._id);
    if (!user) {
      throw new ForbiddenException();
    }

    const isValidToken = await this.tokensService.refreshTokenIsValid(
      user.refresh_token,
    );
    const isTheSameToken = refresh_token_from_request === user.refresh_token;

    if (!isValidToken || !isTheSameToken) {
      throw new ForbiddenException();
    }

    return payload;
  }
}
