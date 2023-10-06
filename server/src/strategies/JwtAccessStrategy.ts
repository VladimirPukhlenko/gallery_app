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
// import configService from '../config/configuration';

export type JwtPayload = {
  email: string;
  fullName: string;
  _id: string;
  iat: number;
  exp: number;
};
@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtAccessStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: configService.get('JWT_KEY_ACCESS'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['access_token'];
    if (!token) {
      throw new HttpException('Forbitten', HttpStatus.FORBIDDEN);
    }
    return token;
  }
  async validate(payload: JwtPayload) {
    return payload;
  }
}
