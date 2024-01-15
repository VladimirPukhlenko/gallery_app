import { Keys } from './../../../types/Keys.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Types } from 'mongoose';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';

type UserPayload = {
  email: string;
  fullName: string;
  _id: Types.ObjectId;
  activeRefreshTokenId?: string;
};
@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService)
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async generateToken<T extends 'access' | 'refresh'>(
    tokenType: T,
    user: T extends 'access' ? UserPayload : Required<UserPayload>,
  ) {
    const { email, fullName, _id, activeRefreshTokenId } = user;

    const tokensData = {
      access: {
        key: Keys.JWT_KEY_ACCESS,
        expiresIn: this.getExpAccessToken(),
        payload: { email, fullName, _id },
      },
      refresh: {
        key: Keys.JWT_KEY_REFRESH,
        expiresIn: this.getExpRefreshToken(),
        payload: { email, fullName, _id, activeRefreshTokenId },
      },
    };

    const token = await this.jwtService.signAsync(
      tokensData[tokenType].payload,
      {
        secret: this.configService.get(tokensData[tokenType].key),
        expiresIn: tokensData[tokenType].expiresIn,
      },
    );
    return token;
  }

  async generateRecoveryToken(keyObj: { key: string; _id: string }) {
    return await this.jwtService.signAsync(keyObj, {
      secret: this.configService.get<string>(Keys.JWT_KEY_RECOVERY),
      expiresIn: '1h',
    });
  }

  async updateActiveRefreshTokenId(
    userId: string,
    activeRefreshTokenId: string,
  ) {
    await this.usersService.updateById(userId, {
      activeRefreshTokenId: activeRefreshTokenId,
    });
  }

  async verifyToken<T>(token: string, secret: string): Promise<T> {
    const data = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(secret),
    });
    return data;
  }

  async refreshTokenIsValid(token: string) {
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get(Keys.JWT_KEY_REFRESH),
      });
      return true;
    } catch (_) {
      return false;
    }
  }

  generateRecoveryKey(length: number = 5) {
    return uuidv4().slice(0, length).toLowerCase();
  }
  generateUuid() {
    return uuidv4();
  }

  getExpAccessToken(expType: 'str' | 'msec' = 'str') {
    return {
      str: this.configService.get('TOKENS.ACCESS_TOKEN_EXP'),
      msec:
        Date.now() + +this.configService.get('TOKENS.ACCESS_TOKEN_EXP_MSEC'),
    }[expType];
  }
  getExpRecoveryToken(expType: 'str' | 'msec' = 'str') {
    return {
      str: this.configService.get('TOKENS.RECOVERY_TOKEN_EXP'),
      msec:
        Date.now() + +this.configService.get('TOKENS.RECOVERY_TOKEN_EXP_MSEC'),
    }[expType];
  }
  getExpRefreshToken(expType: 'str' | 'msec' = 'str') {
    return {
      str: this.configService.get('TOKENS.REFRESH_TOKEN_EXP'),
      msec:
        Date.now() + +this.configService.get('TOKENS.REFRESH_TOKEN_EXP_MSEC'),
    }[expType];
  }
  isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }
}
