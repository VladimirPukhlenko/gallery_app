import { Keys } from './../../types/Keys.enum';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
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
    response.cookie(Keys.REFRESH_TOKEN, tokens.refresh_token, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      httpOnly: this.tokenService.isProduction(),
      maxAge: this.tokenService.getExpRefreshToken('msec') as number,
      secure: this.tokenService.isProduction(),
    });
    response.cookie(Keys.ACCESS_TOKEN, tokens.access_token, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      httpOnly: this.tokenService.isProduction(),
      maxAge: this.tokenService.getExpAccessToken('msec') as number,
      secure: this.tokenService.isProduction(),
    });
    return { user, tokens };
  }

  @UseGuards(JwtGuardRefresh)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: AuthorizedRequest,
    @Query('type') type?: string,
  ) {
    if (type === 'validate') {
      return { message: 'success' };
    }
    const newAccessToken = await this.tokenService.generateToken('access', {
      ...request.user,
      _id: new Types.ObjectId(request.user._id),
    });
    response.cookie(Keys.ACCESS_TOKEN, newAccessToken, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      maxAge: this.tokenService.getExpAccessToken('msec') as number,
      httpOnly: this.tokenService.isProduction(),
      secure: this.tokenService.isProduction(),
    });
    return { [Keys.ACCESS_TOKEN]: newAccessToken };
  }

  @Post('recovery')
  @HttpCode(HttpStatus.OK)
  async recovery(
    @Res({ passthrough: true }) response: Response,
    @Body() recoveryDto: RecoveryDto,
  ) {
    const recoveryToken = await this.authService.recovery(recoveryDto);

    response.cookie(Keys.RECOVERY_TOKEN, recoveryToken, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      maxAge: this.tokenService.getExpRecoveryToken('msec') as number,
      httpOnly: this.tokenService.isProduction(),
      secure: this.tokenService.isProduction(),
    });
    return {
      [Keys.RECOVERY_TOKEN]: recoveryToken,
    };
  }
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie(Keys.ACCESS_TOKEN, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      httpOnly: this.tokenService.isProduction(),
      secure: this.tokenService.isProduction(),
      expires: new Date(0),
    });

    response.clearCookie(Keys.REFRESH_TOKEN, {
      sameSite: this.tokenService.isProduction() ? 'none' : 'lax',
      httpOnly: this.tokenService.isProduction(),
      secure: this.tokenService.isProduction(),
      expires: new Date(0),
    });

    return {
      message: 'success',
    };
  }

  @UseGuards(JwtGuardRecovery)
  @Post('recovery/confirmation')
  @HttpCode(HttpStatus.OK)
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
    return {
      message: 'success',
    };
  }
}
