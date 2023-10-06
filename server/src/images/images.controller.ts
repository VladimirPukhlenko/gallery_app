import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ImagesService } from './images.service';
import { AddImageDto } from './dto/add-image.dto';
import { JwtGuardAccess } from 'src/guards/jwt-access.guard';
import { AuthorizedRequest } from 'src/types/types';
import { ObjectId } from 'mongoose';
import { UsersService } from 'src/users/users.service';

@Controller('images')
export class ImagesController {
  constructor(
    private imagesService: ImagesService,
    private usersService: UsersService,
  ) {}
  @UseGuards(JwtGuardAccess)
  @Get('/userImages')
  async getUserImages(
    @Req() req: AuthorizedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('album') albumId?: string,
    @Query('type') type?: 'favorites',
  ) {
    return await this.imagesService.getUserImages({
      type,
      albumId: albumId || '',
      page: +page || 1,
      limit: +limit || 5,
      userId: req.user._id,
    });
  }

  @Get()
  async getAllImages(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.imagesService.getAllImages({
      page: page || 1,
      limit: limit || 10,
    });
  }
  @UseGuards(JwtGuardAccess)
  @Post()
  async addImage(
    @Body() addImageDto: AddImageDto,
    @Req() req: AuthorizedRequest,
  ) {
    const image = await this.imagesService.addImage(addImageDto, req.user._id);
    return image;
  }
  @UseGuards(JwtGuardAccess)
  @Delete('/:imageId')
  async deleteImage(
    @Param('imageId') imageId: string,
    @Req() req: AuthorizedRequest,
  ) {
    console.log(imageId);
    await this.imagesService.deleteImage(req.user._id, imageId);
    return {
      message: 'success',
    };
  }

  @UseGuards(JwtGuardAccess)
  @Patch('/:imageId/favorites')
  async addImageToFavorites(
    @Param('imageId') imageId: string,
    @Req() req: AuthorizedRequest,
  ) {
    await this.usersService.updateFavoritesArrayToggle(req.user._id, imageId);
    return {
      message: 'success',
    };
  }
}
