import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { ObjectId } from 'mongoose';

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
      secretOrKey: configService.get('JWT_KEY_RECOVERY'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['recovery_token'];
    if (!token) {
      throw new HttpException('Forbitten', HttpStatus.FORBIDDEN);
    }
    return token;
  }
  async validate(payload: JwtPayloadRecovery) {
    return payload;
  }
}
