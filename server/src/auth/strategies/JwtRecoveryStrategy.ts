import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Keys } from 'types/Keys.enum';

export type JwtPayloadRecovery = {
  _id: string;
  key: string;
  iat: number;
  exp: number;
};
@Injectable()
export class JwtRecoveryStrategy extends PassportStrategy(
  Strategy,
  'jwt-recovery',
) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRecoveryStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: configService.get('TOKENS.JWT_KEY_RECOVERY'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies[Keys.RECOVERY_TOKEN];

    if (!token) {
      throw new ForbiddenException();
    }
    return token;
  }

  validate(payload: JwtPayloadRecovery) {
    return payload;
  }
}
