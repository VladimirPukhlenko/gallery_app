import { Injectable } from '@nestjs/common';

import { UserImagesService } from './services/user-images.service';
import { AddImageDto } from './dto/add-image.dto';
import { ImageManagementService } from './services/image-management.service';
import mongoose from 'mongoose';

@Injectable()
export class ImagesService {
  constructor(
    private userImagesService: UserImagesService,
    private imageManagementService: ImageManagementService,
  ) {}

  getAllImages(page: number, limit: number) {
    return this.userImagesService.getAllImages(page, limit);
  }

  addImage(addImageDto: AddImageDto, userId: string) {
    return this.imageManagementService.addImage(addImageDto, userId);
  }
  deleteImage(userId: string, imageId: string) {
    return this.imageManagementService.deleteImage(userId, imageId);
  }

  favoritesImagesToggle(userId: string, imageId: string) {
    return this.imageManagementService.favoritesImagesToggle(userId, imageId);
  }
  getUserFavorites(page: number, limit: number, userId: string) {
    return this.userImagesService.getUserFavorites(page, limit, userId);
  }

  getUserImages(page: number, limit: number, userId: string, albumId?: string) {
    if (albumId) {
      return this.userImagesService.getImagesFromAlbum(
        page,
        limit,
        albumId,
        userId,
      );
    }
    return this.userImagesService.getUserImages(page, limit, userId);
  }
}
