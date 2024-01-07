import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';

import { Album, AlbumDocument } from 'src/schemas/Album.schema';
import { UserAlbumsService } from './services/user-albums.service';
import { AlbumManagementService } from './services/album-management.service';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name)
    private imageModel: Model<AlbumDocument>,
    private userAlbumsService: UserAlbumsService,
    private albumManagementService: AlbumManagementService,
  ) {}

  findById(albumsId: string) {
    return this.imageModel.findById(albumsId);
  }
  findOne(data: any) {
    return this.imageModel.findOne(data);
  }

  getAllUserAlbums(
    page: number,
    limit: number,
    userId: string,
    populate: boolean,
    populateLimit: number,
  ) {
    return this.userAlbumsService.getAllUserAlbums(
      page,
      limit,
      userId,
      populate,
      populateLimit,
    );
  }

  createAlbum(name: string, userId: string) {
    return this.albumManagementService.createAlbum(name, userId);
  }

  renameAlbum(albumId: string, userId: string, newName: string) {
    return this.albumManagementService.renameAlbum(albumId, userId, newName);
  }
  deleteAlbum(albumId: string, userId: string) {
    return this.albumManagementService.deleteAlbum(albumId, userId);
  }
  getSingleUserAlbum(albumId: string, userId: string) {
    return this.userAlbumsService.getSingleUserAlbum(albumId, userId);
  }
  imagesInAlbumToggle(albumId: string, userId: string, imageId: string) {
    return this.albumManagementService.imagesInAlbumToggle(
      albumId,
      userId,
      imageId,
    );
  }
}
