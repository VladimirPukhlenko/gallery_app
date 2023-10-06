import {
  ForbiddenException,
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
import { async } from 'rxjs';
import { validate } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { TokensService } from 'src/tokens/tokens.service';
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
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private tokensService: TokensService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtRefreshStrategy.extractJwtFromCookie,
      ]),
      secretOrKey: configService.get<string>('JWT_KEY_REFRESH'),
    });
  }

  public static extractJwtFromCookie(request: Request) {
    const token = request?.cookies['refresh_token'];
    if (!token) {
      throw new UnauthorizedException();
    }
    return token;
  }

  async validate(payload: JwtPayload) {
    const user = await this.usersService.findUserById(payload._id);
    if (!user) {
      throw new ForbiddenException();
    }

    try {
      const userPayload = await this.tokensService.verifyToken<JwtPayload>(
        user.refresh_token,
        'JWT_KEY_REFRESH',
      );
      const isTheSameToken = userPayload.iat === payload.iat;
      const isTheSameUser = userPayload._id === payload._id;
      if (!isTheSameToken || !isTheSameUser) {
        throw new ForbiddenException();
      }
    } catch (e) {
      throw new ForbiddenException();
    }
    return payload;
  }
}
