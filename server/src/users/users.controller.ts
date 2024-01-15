import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { AuthorizedRequest } from 'types/request.interface';
import { UsersService } from './users.service';
import { JwtGuardAccess } from 'src/auth/guards/jwt-access.guard';
import { EditUserDto } from './dto/edit-user.dto';

@UseGuards(JwtGuardAccess)
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}
  @Get('me')
  async getUser(@Req() req: AuthorizedRequest) {
    const fullUser = await this.usersService.findById(req.user._id);
    const { password, activeRefreshTokenId, ...user } = fullUser.toObject();
    return user;
  }

  @Patch('edit')
  async editUser(
    @Req() req: AuthorizedRequest,
    @Body() editUserDto: EditUserDto,
  ) {
    return await this.usersService.editUser(req.user._id, editUserDto);
  }
}
