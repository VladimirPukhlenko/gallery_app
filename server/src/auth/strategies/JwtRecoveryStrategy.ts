import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Strategy, ExtractJwt } from 'passport-jwt';

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

  static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['recovery_token'];
    if (!token) {
      throw new ForbiddenException();
    }
    return token;
  }
  async validate(payload: JwtPayloadRecovery) {
    return payload;
  }
}
