import { CryptoService } from 'src/auth/services/crypto.service';
import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { RegistrationUserDto } from '../dto/registration-user.dto';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';

@Injectable()
export class RegistrationService {
  constructor(
    private usersService: UsersService,
    private tokenService: TokenService,
  ) {}

  async registration(registrationUserDto: RegistrationUserDto) {
    const existingUser = await this.usersService.findByEmail(
      registrationUserDto.email,
    );
    if (existingUser) {
      throw new ConflictException(
        'This email is already in use, please provide another one.',
      );
    }

    const newUser = await this.usersService.createUser(registrationUserDto);

    const { password, activeRefreshTokenId, ...user } = newUser.toObject();

    return user;
  }
}
