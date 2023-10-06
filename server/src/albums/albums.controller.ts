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
import { JwtGuardAccess } from 'src/guards/jwt-access.guard';
import { AuthorizedRequest } from 'src/types/types';
import { AlbumsService } from './albums.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { RenameAlbumDto } from './dto/rename-album.dto';
import { AddImageToAlbumDto } from './dto/add-image-to-album.dto';

@UseGuards(JwtGuardAccess)
@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}

  @Get()
  async getAllUserAlbums(
    @Req() req: AuthorizedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return await this.albumsService.getAllUserAlbums({
      page: +page || 1,
      limit: +limit || 5,
      userId: req.user._id,
    });
  }
  @Post()
  async createAlbum(
    @Req() req: AuthorizedRequest,
    @Body() createAlbumDto: CreateAlbumDto,
  ) {
    return await this.albumsService.createAlbum(
      createAlbumDto.name,
      req.user._id,
    );
  }
  @Post('/:albumId/images')
  async addImageToAlbum(
    @Req() req: AuthorizedRequest,
    @Body() addImageToAlbumDto: AddImageToAlbumDto,
    @Param('albumId') albumId: string,
  ) {
    const { imageId } = addImageToAlbumDto;
    await this.albumsService.updateAlbumImages({
      albumId,
      userId: req.user._id,
      imageId,
      action: 'add',
    });
  }

  @Patch('/:albumId')
  async renameAlbum(
    @Req() req: AuthorizedRequest,
    @Param('albumId') albumId: string,
    @Body() renameAlbumDto: RenameAlbumDto,
  ) {
    return await this.albumsService.renameAlbum(
      albumId,
      req.user._id,
      renameAlbumDto.newName,
    );
  }

  @Delete('/:albumId/images/:imageId')
  async deleteImageFromAlbum(
    @Req() req: AuthorizedRequest,
    @Param('albumId') albumId: string,
    @Param('imageId') imageId: string,
  ) {
    await this.albumsService.updateAlbumImages({
      albumId,
      userId: req.user._id,
      imageId,
      action: 'delete',
    });
    return {
      message: 'success',
    };
  }
  @Delete('/:albumId')
  async deleteAlbum(
    @Req() req: AuthorizedRequest,
    @Param('albumId') albumId: string,
  ) {
    await this.albumsService.deleteAlbum(albumId, req.user._id);
    return {
      message: 'success',
    };
  }
}
