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

import { JwtPayload, JwtPayloadRefresh } from 'types/JwtPayload.interface';
import { TokenService } from '../services/token.service';
import { Keys } from 'types/Keys.enum';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: configService.get('TOKENS.JWT_KEY_REFRESH'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies[Keys.REFRESH_TOKEN];

    if (!token) {
      throw new ForbiddenException();
    }
    return token;
  }
  async validate(payload: JwtPayloadRefresh) {
    const user = await this.usersService.findById(payload._id);
    const isValidToken =
      payload.activeRefreshTokenId === user?.activeRefreshTokenId;
    if (!user || !isValidToken) {
      throw new ForbiddenException();
    }

    return payload;
  }
}
