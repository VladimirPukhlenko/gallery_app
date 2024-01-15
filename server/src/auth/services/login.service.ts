import { ConflictException, Injectable } from '@nestjs/common';
import { LoginDto } from '../dto/login.dto';
import { UsersService } from 'src/users/users.service';
import { CryptoService } from './crypto.service';
import { TokenService } from './token.service';

@Injectable()
export class LoginService {
  constructor(
    private usersService: UsersService,
    private cryptoService: CryptoService,
    private tokenService: TokenService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const existingUser = await this.usersService.findByEmail(email);
    const isValidPassword = await this.cryptoService.compareData(
      password,
      existingUser?.password || '',
    );
    if (!existingUser || !isValidPassword) {
      throw new ConflictException('Wrong email or password');
    }

    const tokens = {
      access_token: await this.tokenService.generateToken(
        'access',
        existingUser,
      ),
      refresh_token: await this.tokenService.generateToken(
        'refresh',
        existingUser,
      ),
    };

    const {
      password: pass,
      activeRefreshTokenId,
      ...user
    } = existingUser.toObject();
    return {
      user,
      tokens,
    };
  }
}
