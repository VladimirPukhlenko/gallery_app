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
import { Response } from 'express';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
import { JwtGuardRefresh } from '../guards/jwt-refresh.guard';
import { AuthorizedRequest, RecoveryRequest } from 'src/types/types';
import { RecoveryDto } from './dto/recovery.dto';
import { JwtGuardRecovery } from 'src/guards/jwt-recovery.guard';
import { RecoveryConfirmDto } from './dto/recovery-confirmation.dto';
import { TokensService } from 'src/tokens/tokens.service';
import { User } from 'src/schemas/User.schema';
import { Types } from 'mongoose';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly tokensService: TokensService,
  ) {}

  @Post('registration')
  async registration(@Body() createUserDto: CreateUserDto) {
    return await this.authService.registration(createUserDto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { access_token, refresh_token } =
      await this.authService.login(loginDto);

    response.cookie('access_token', access_token, {
      httpOnly: this.tokensService.isProduction(),
      expires: this.tokensService.getExpAccessToken(),
    });
    response.cookie('refresh_token', refresh_token, {
      httpOnly: this.tokensService.isProduction(),
    });

    return { message: 'success' };
  }

  @Get('logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');
    return { message: 'success' };
  }

  @UseGuards(JwtGuardRefresh)
  @Get('refresh')
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: AuthorizedRequest,
  ): Promise<{ message: string }> {
    const { _id, email, fullName } = request.user;
    const newAccessToken = await this.tokensService.generateAccessToken({
      _id,
      email,
      fullName,
    } as unknown as User);

    response.cookie('access_token', newAccessToken, {
      httpOnly: this.tokensService.isProduction(),
      expires: this.tokensService.getExpAccessToken(),
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

    response.cookie('recovery_token', recoveryToken, {
      httpOnly: this.tokensService.isProduction(),
      expires: this.tokensService.getExpRecoveryToken(),
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
    await this.authService.confirmation(recoveryConfirmDto, request.user);

    response.clearCookie('recovery_token');
    response.clearCookie('access_token');
    response.clearCookie('refresh_token');

    return {
      message: 'success',
    };
  }
}
