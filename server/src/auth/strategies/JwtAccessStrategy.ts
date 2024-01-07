import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { JwtPayload } from 'types/JwtPayload.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(ConfigService)
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAccessStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: configService.get('TOKENS.JWT_KEY_ACCESS'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['access_token'];

    if (!token) {
      throw new ForbiddenException();
    }
    return token;
  }
  async validate(payload: JwtPayload) {
    return payload;
  }
}
