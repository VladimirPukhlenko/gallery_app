import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';

import { ImagesService } from './images.service';
import { JwtGuardAccess } from 'src/auth/guards/jwt-access.guard';
import { AuthorizedRequest } from 'types/request.interface';
import { AddImageDto } from './dto/add-image.dto';

@Controller('images')
export class ImagesController {
  constructor(private imagesService: ImagesService) {}
  @Get()
  async getAllImages(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.imagesService.getAllImages(page || 1, limit || 20);
  }
  @UseGuards(JwtGuardAccess)
  @Post()
  async addImage(
    @Body() addImageDto: AddImageDto,
    @Req() req: AuthorizedRequest,
  ) {
    return await this.imagesService.addImage(addImageDto, req.user._id);
  }
  @UseGuards(JwtGuardAccess)
  @Delete('/:imageId')
  async deleteImage(
    @Param('imageId') imageId: string,
    @Req() req: AuthorizedRequest,
  ) {
    await this.imagesService.deleteImage(req.user._id, imageId);
    return {
      message: 'success',
    };
  }
  @UseGuards(JwtGuardAccess)
  @Get('userImages')
  async getUserImages(
    @Req() req: AuthorizedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('album') albumId?: string,
  ) {
    return await this.imagesService.getUserImages(
      +page || 1,
      +limit || 20,
      req.user._id,
      albumId,
    );
  }
  @UseGuards(JwtGuardAccess)
  @Get('userImages/favorites')
  async getUserFavorites(
    @Req() req: AuthorizedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.imagesService.getUserFavorites(
      +page || 1,
      +limit || 20,
      req.user._id,
    );
  }
  @UseGuards(JwtGuardAccess)
  @Patch('/:imageId/favorites')
  async addImageToFavorites(
    @Param('imageId') imageId: string,
    @Req() req: AuthorizedRequest,
  ) {
    await this.imagesService.favoritesImagesToggle(req.user._id, imageId);
    return {
      message: 'success',
    };
  }
}
