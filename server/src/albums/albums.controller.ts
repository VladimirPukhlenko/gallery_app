import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseBoolPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthorizedRequest } from 'types/request.interface';
import { AlbumsService } from './albums.service';
import { JwtGuardAccess } from 'src/auth/guards/jwt-access.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { AddImageToAlbumDto } from './dto/add-image-to-album.dto';
import { RenameAlbumDto } from './dto/rename-album.dto';

@UseGuards(JwtGuardAccess)
@Controller('albums')
export class AlbumsController {
  constructor(private albumsService: AlbumsService) {}
  @Get()
  async getAllUserAlbums(
    @Req() req: AuthorizedRequest,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('populate') populate?: boolean,
    @Query('populateLimit') populateLimit?: number,
  ) {
    return await this.albumsService.getAllUserAlbums(
      +page || 1,
      +limit || 100,
      req.user._id,
      populate,
      +populateLimit || 5,
    );
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
  @Patch('/:albumId/images')
  async imagesInAlbumToggle(
    @Req() req: AuthorizedRequest,
    @Body() addImageToAlbumDto: AddImageToAlbumDto,
    @Param('albumId') albumId: string,
  ) {
    const { imageId } = addImageToAlbumDto;
    await this.albumsService.imagesInAlbumToggle(
      albumId,
      req.user._id,
      imageId,
    );
    return { message: 'success' };
  }
  @Delete('/:albumId')
  async deleteAlbum(
    @Req() req: AuthorizedRequest,
    @Param('albumId') albumId: string,
  ) {
    await this.albumsService.deleteAlbum(albumId, req.user._id);
    return { message: 'success' };
  }
  @Get('/:albumId')
  async getSingleUserId(
    @Req() req: AuthorizedRequest,
    @Param('albumId') albumId: string,
  ) {
    return await this.albumsService.getSingleUserAlbum(albumId, req.user._id);
  }
}
