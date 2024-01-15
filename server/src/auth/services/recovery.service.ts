import { CryptoService } from 'src/auth/services/crypto.service';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { RecoveryDto } from '../dto/recovery.dto';
import { UsersService } from 'src/users/users.service';
import { TokenService } from './token.service';
import { MailService } from './mail.service';
import { RecoveryConfirmDto } from '../dto/recovery-confirmation.dto';
import { JwtPayloadRecovery } from '../strategies/JwtRecoveryStrategy';

@Injectable()
export class RecoveryService {
  constructor(
    private usersService: UsersService,
    private tokensSevice: TokenService,
    private mailService: MailService,
    private cryptoService: CryptoService,
  ) {}

  async recovery(recoveryDto: RecoveryDto) {
    const user = await this.usersService.findByEmail(recoveryDto.email);
    if (!user) {
      throw new NotFoundException(
        `User with email ${recoveryDto.email} not found.`,
      );
    }
    const key = this.tokensSevice.generateRecoveryKey();
    await this.mailService.sendKey(
      user.fullName,
      user.email,
      key.toUpperCase(),
    );
    const hashedKey = await this.cryptoService.hashData(key);
    const tokenWithKey = await this.tokensSevice.generateRecoveryToken({
      key: hashedKey,
      _id: user._id.toString(),
    });
    return tokenWithKey;
  }

  async recoveryConfirmation(
    recoveryConfirmDto: RecoveryConfirmDto,
    user: JwtPayloadRecovery,
  ) {
    const { password, key } = recoveryConfirmDto;
    const keyIsValid = await this.cryptoService.compareData(
      key.toLowerCase(),
      user.key,
    );
    if (!keyIsValid) {
      throw new ConflictException('Recovery key is incorrect');
    }

    await this.usersService.updateById(user._id, {
      password: await this.cryptoService.hashData(password),
      activeRefreshTokenId: this.tokensSevice.generateUuid(),
    });
  }
}
