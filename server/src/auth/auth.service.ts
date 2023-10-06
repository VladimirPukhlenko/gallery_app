import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';
import { RecoveryDto } from './dto/recovery.dto';
import { v4 as uuidv4 } from 'uuid';
import { MailService } from 'src/mail/mail.service';
import { RecoveryConfirmDto } from './dto/recovery-confirmation.dto';
import { JwtPayloadRecovery } from 'src/strategies/JwtRecoveryStrategy';
import { TokensService } from 'src/tokens/tokens.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private usersService: UsersService,
    private tokensService: TokensService,
    private mailService: MailService,
  ) {}

  async registration(createUserDto: CreateUserDto) {
    const existingUser = await this.usersService.findByEmail(
      createUserDto.email,
    );
    if (existingUser) {
      throw new HttpException(
        'This email is already in use, please provide another one.',
        HttpStatus.CONFLICT,
      );
    }
    const newUser = await this.usersService.createUser(createUserDto);
    const refreshToken = await this.tokensService.generateRefreshToken(newUser);

    await this.tokensService.updateRefreshToken(
      refreshToken,
      newUser._id.toString(),
    );

    return {
      message: 'success',
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.usersService.findByEmail(email);
    const isValidPassword = await bcrypt.compare(
      password,
      existingUser?.password || '',
    );
    if (!existingUser || !isValidPassword) {
      throw new HttpException('Wrong email or password', HttpStatus.CONFLICT);
    }
    const access_token =
      await this.tokensService.generateAccessToken(existingUser);
    const tokens = {
      access_token,
      refresh_token: existingUser.refresh_token,
    };
    try {
      await this.tokensService.verifyToken(
        existingUser.refresh_token,
        'JWT_KEY_REFRESH',
      );
    } catch (e) {
      const newRefreshToken =
        await this.tokensService.generateRefreshToken(existingUser);
      await this.tokensService.updateRefreshToken(
        newRefreshToken,
        existingUser._id.toString(),
      );
      tokens.refresh_token = newRefreshToken;
    }

    return tokens;
  }
  async recovery(recoveryDto: RecoveryDto) {
    const user = await this.usersService.findByEmail(recoveryDto.email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    const key = await this.generateRecoveryKey();
    await this.mailService.sendKey(
      user.fullName,
      user.email,
      key.toUpperCase(),
    );
    const hashedKey = await this.hashData(key);
    const tokenWithKey = await this.tokensService.generateRecoveryToken({
      key: hashedKey,
      _id: user._id.toString(),
    });
    return tokenWithKey;
  }

  async hashData<T extends string | Buffer>(data: T): Promise<string> {
    const hashedData = await bcrypt.hash(data, 10);
    return hashedData;
  }

  async generateRecoveryKey(): Promise<string> {
    const shortKey = uuidv4().slice(0, 5);
    return shortKey.toLowerCase();
  }

  async confirmation(
    recoveryConfirmDto: RecoveryConfirmDto,
    user: JwtPayloadRecovery,
  ) {
    const keyIsValid = await bcrypt.compare(
      recoveryConfirmDto.key.toLowerCase(),
      user.key,
    );
    if (!keyIsValid) {
      throw new BadRequestException('Recovery key is incorrect');
    }
    const requiredUser = await this.usersService.findUserById(user._id);
    if (!requiredUser) {
      throw new NotFoundException('User not found');
    }
    await this.usersService.updateUserPassword(
      user._id,
      recoveryConfirmDto.password,
    );
    await this.tokensService.updateRefreshToken('', user._id);
  }
}
