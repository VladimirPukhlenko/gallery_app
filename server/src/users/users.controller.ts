import {
  Controller,
  Get,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersRepository } from './users.repository';
import { JwtGuardAccess } from 'src/guards/jwt-access.guard';
import { ConfigService } from '@nestjs/config';
import { AuthorizedRequest } from 'src/types/types';

@UseGuards(JwtGuardAccess)
@Controller('users')
export class UsersController {
  constructor(
    private usersService: UsersService,
    @Inject(ConfigService)
    private readonly configService: ConfigService,
    private usersRepository: UsersRepository,
  ) {}

  @Get()
  async getData(@Req() req: AuthorizedRequest) {
    return this.usersService.getAllUsers();
  }
}
