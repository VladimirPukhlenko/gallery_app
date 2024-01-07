import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Image, ImageDocument } from '../../schemas/Image.schema';
import { AlbumsService } from 'src/albums/albums.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class UserImagesService {
  constructor(
    @InjectModel(Image.name)
    private imageModel: Model<ImageDocument>,
    private albumsService: AlbumsService,
    private usersService: UsersService,
  ) {}

  async getAllImages(page: number, limit: number) {
    const skip = limit * (page - 1);
    const totalItems = await this.imageModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const data = await this.imageModel
      .find()
      .sort({ createdAt: 'descending' })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'creator',
        select: ['fullName', 'picture'],
      });
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data,
    };
  }
  async getImagesFromAlbum(
    page: number,
    limit: number,
    albumsId: string,
    userId: string,
  ) {
    const skip = limit * (page - 1);

    const album = await this.albumsService.findOne({
      author: userId.toString(),
      _id: albumsId.toString(),
    });

    if (!album) {
      return new NotFoundException('Album not found');
    }
    const totalItems = album.images.length;
    const totalPages = Math.ceil(totalItems / limit);
    const data = await album.populate({
      path: 'images',
      options: {
        skip,
        limit,
      },
      populate: {
        path: 'creator',
        select: ['fullName', 'picture'],
      },
    });
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data: data.images.reverse(),
    };
  }

  async getUserFavorites(page: number, limit: number, userId: string) {
    const user = await this.usersService.findById(userId);
    const skip = limit * (page - 1);
    const totalItems = user.toObject().favorites.length;
    const totalPages = Math.ceil(totalItems / limit);
    const data = await user.populate({
      path: 'favorites',
      options: {
        skip,
        limit,
      },
      populate: {
        path: 'creator',
        select: ['fullName', 'picture'],
      },
    });
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data: data.favorites.reverse(),
    };
  }
  async getUserImages(page: number, limit: number, userId: string) {
    const skip = limit * (page - 1);
    const totalItems = await this.imageModel.countDocuments();
    const totalPages = Math.ceil(totalItems / limit);
    const data = await this.imageModel
      .find({ creator: userId })
      .sort({ createdAt: 'descending' })
      .skip(skip)
      .limit(limit)
      .populate({
        path: 'creator',
        select: ['fullName', 'picture'],
      });
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data,
    };
  }
}
