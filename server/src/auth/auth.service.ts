import { Injectable } from '@nestjs/common';
import { LoginService } from './services/login.service';
import { RecoveryService } from './services/recovery.service';

import { RegistrationService } from './services/registration.service';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { LoginDto } from './dto/login.dto';
import { RecoveryConfirmDto } from './dto/recovery-confirmation.dto';
import { JwtPayloadRecovery } from './strategies/JwtRecoveryStrategy';
import { RecoveryDto } from './dto/recovery.dto';

@Injectable()
export class AuthService {
  constructor(
    private registrationService: RegistrationService,
    private loginService: LoginService,
    private recoveryService: RecoveryService,
  ) {}

  registration(registrationUserDto: RegistrationUserDto) {
    return this.registrationService.registration(registrationUserDto);
  }
  login(loginDto: LoginDto) {
    return this.loginService.login(loginDto);
  }

  recovery(recoveryDto: RecoveryDto) {
    return this.recoveryService.recovery(recoveryDto);
  }
  recoveryConfirmation(
    recoveryConfirmDto: RecoveryConfirmDto,
    user: JwtPayloadRecovery,
  ) {
    return this.recoveryService.recoveryConfirmation(recoveryConfirmDto, user);
  }
}
