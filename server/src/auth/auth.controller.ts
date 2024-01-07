import { Keys } from './../../types/Keys.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegistrationUserDto } from './dto/registration-user.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { TokenService } from './services/token.service';

import { AuthorizedRequest, RecoveryRequest } from 'types/request.interface';
import { JwtGuardRefresh } from './guards/jwt-refresh.guard';
import { Types } from 'mongoose';
import { RecoveryConfirmDto } from './dto/recovery-confirmation.dto';
import { JwtGuardRecovery } from './guards/jwt-recovery.guard';
import { RecoveryDto } from './dto/recovery.dto';
import { MailService } from './services/mail.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private tokenService: TokenService,
  ) {}
  @Post('registration')
  async registration(@Body() registrationUserDto: RegistrationUserDto) {
    return await this.authService.registration(registrationUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    response.cookie(Keys.ACCESS_TOKEN, tokens.access_token, {
      httpOnly: this.tokenService.isProduction(),
      expires: this.tokenService.getExpAccessToken(),
    });
    response.cookie(Keys.REFRESH_TOKEN, tokens.refresh_token, {
      httpOnly: this.tokenService.isProduction(),
    });
    return user;
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(Keys.ACCESS_TOKEN);
    response.clearCookie(Keys.REFRESH_TOKEN);
    return { message: 'success' };
  }

  @UseGuards(JwtGuardRefresh)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: AuthorizedRequest,
  ) {
    const newAccessToken = await this.tokenService.generateToken(
      { ...request.user, _id: new Types.ObjectId(request.user._id) },
      'access',
    );

    response.cookie(Keys.ACCESS_TOKEN, newAccessToken, {
      httpOnly: this.tokenService.isProduction(),
      expires: this.tokenService.getExpAccessToken(),
    });

    return { message: 'success' };
  }

  @Post('recovery')
  @HttpCode(HttpStatus.OK)
  async recovery(
    @Res({ passthrough: true }) response: Response,
    @Body() recoveryDto: RecoveryDto,
  ) {
    const recoveryToken = await this.authService.recovery(recoveryDto);

    response.cookie(Keys.RECOVERY_TOKEN, recoveryToken, {
      httpOnly: this.tokenService.isProduction(),
      expires: this.tokenService.getExpRecoveryToken(),
    });

    return {
      message: 'success',
    };
  }
  @UseGuards(JwtGuardRecovery)
  @Post('recovery/confirmation')
  async confirmation(
    @Req() request: RecoveryRequest,
    @Res({ passthrough: true }) response: Response,
    @Body() recoveryConfirmDto: RecoveryConfirmDto,
  ) {
    await this.authService.recoveryConfirmation(
      recoveryConfirmDto,
      request.user,
    );

    response.clearCookie(Keys.RECOVERY_TOKEN);
    response.clearCookie(Keys.ACCESS_TOKEN);
    response.clearCookie(Keys.REFRESH_TOKEN);
    Keys.RECOVERY_TOKEN;
    return {
      message: 'success',
    };
  }
}
