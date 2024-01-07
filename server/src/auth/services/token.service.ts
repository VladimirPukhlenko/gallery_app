import { Keys } from './../../../types/Keys.enum';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/schemas/User.schema';
import { UsersService } from 'src/users/users.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TokenService {
  constructor(
    private jwtService: JwtService,
    @Inject(ConfigService)
    private configService: ConfigService,
    private usersService: UsersService,
  ) {}

  async generateToken(
    user: Pick<User, 'email' | 'fullName' | '_id'>,
    tokenType: 'access' | 'refresh',
  ) {
    const key = {
      access: Keys.JWT_KEY_ACCESS,
      refresh: Keys.JWT_KEY_REFRESH,
    };

    const expiresIn = tokenType === 'access' ? '50m' : '30d';

    const { email, fullName, _id } = user;
    const payload = { email, fullName, _id };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get(key[tokenType]),
      expiresIn,
    });
    if (tokenType === 'refresh') {
      await this.updateRefreshToken(_id.toString(), token);
    }
    return token;
  }

  public async generateRecoveryToken(keyObj: { key: string; _id: string }) {
    return await this.jwtService.signAsync(keyObj, {
      secret: this.configService.get<string>(Keys.JWT_KEY_RECOVERY),
      expiresIn: '1h',
    });
  }

  async updateRefreshToken(userId: string, token: string) {
    await this.usersService.updateById(userId, { refresh_token: token });
  }

  public async verifyToken<T>(token: string, secret: string): Promise<T> {
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

  getExpAccessToken() {
    return new Date(new Date().getTime() + 50 * 60 * 1000); // 50min
  }
  getExpRecoveryToken() {
    return new Date(new Date().getTime() + 60 * 60 * 1000); // 1h
  }

  isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }

  generateRecoveryKey(length: number = 5) {
    return uuidv4().slice(0, length).toLowerCase();
  }
}
