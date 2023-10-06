import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model, ObjectId } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { MongoRepository } from 'typeorm';

@Injectable()
export class TokensService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private jwtService: JwtService,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  public async generateAccessToken(user: User) {
    const { email, fullName, _id } = user;
    const payload = { email, fullName, _id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_KEY_ACCESS'),
      expiresIn: `20m`,
    });
  }
  public async generateRefreshToken(user: User) {
    const { email, fullName, _id } = user;
    const payload = { email, fullName, _id };
    return await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_KEY_REFRESH'),
      expiresIn: '30d',
    });
  }

  public async generateRecoveryToken(keyObj: { key: string; _id: string }) {
    return await this.jwtService.signAsync(keyObj, {
      secret: this.configService.get<string>('JWT_KEY_RECOVERY'),
      expiresIn: '1h',
    });
  }

  public async updateRefreshToken(token: string, _id: string) {
    await this.userModel.findByIdAndUpdate(_id, { refresh_token: token });
  }

  public async verifyToken<T>(token: string, secret: string): Promise<T> {
    const data = await this.jwtService.verifyAsync(token, {
      secret: this.configService.get<string>(secret),
    });
    return data;
  }

  public getExpAccessToken() {
    return new Date(new Date().getTime() + 20 * 60 * 1000); // 20min
  }
  public getExpRecoveryToken() {
    return new Date(new Date().getTime() + 60 * 60 * 1000); // 1h
  }

  public isProduction() {
    return this.configService.get('NODE_ENV') === 'production';
  }
}
