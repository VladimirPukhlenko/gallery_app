import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, ObjectId, Schema } from 'mongoose';
import { Album } from 'src/schemas/Album.schema';
import { User } from 'src/schemas/User.schema';
import { getAllUserAlbumsArgs, updateAlbumImagesArgs } from 'src/types/types';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<Album>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getAllUserAlbums({ userId, page, limit }: getAllUserAlbumsArgs) {
    const skip = limit * (page - 1);
    const albums = await this.albumModel
      .find({ author: userId })
      .limit(limit)
      .skip(skip);

    const totalItems = await this.albumModel.countDocuments({
      author: userId,
    });
    const totalPages = Math.ceil(totalItems / limit);

    return {
      currentPage: page,
      totalPages,
      totalItems,
      data: albums,
    };
  }

  async createAlbum(name: string, userId: string) {
    const newAlbum = new this.albumModel({
      name,
      author: userId,
    });
    return await newAlbum.save();
  }
  async updateAlbumImages({
    albumId,
    userId,
    imageId,
    action,
  }: updateAlbumImagesArgs) {
    const requredAlbum = await this.albumModel.findById(albumId);

    if (!requredAlbum || requredAlbum.author.toString() !== userId) {
      throw new ForbiddenException();
    }

    if (action === 'add') {
      // temporarily
      requredAlbum.images.push(imageId as unknown as ObjectId);
    } else if (action === 'delete') {
      requredAlbum.images = requredAlbum.images.filter(
        (id) => id.toString() !== imageId,
      );
    } else {
      throw new BadRequestException('Invalid parameters');
    }

    await requredAlbum.save();
  }

  async renameAlbum(albumId: string, userId: string, newName: string) {
    const requredAlbum = await this.albumModel.findById(albumId);
    if (!requredAlbum || requredAlbum.author.toString() !== userId) {
      throw new ForbiddenException();
    }
    requredAlbum.name = newName;
    return await requredAlbum.save();
  }

  async deleteAlbum(albumId: string, userId: string) {
    const requredAlbum = await this.albumModel.findById(albumId);
    if (!requredAlbum || requredAlbum.author.toString() !== userId) {
      throw new ForbiddenException();
    }
    const result = await this.albumModel.findOneAndDelete({
      _id: albumId,
      author: userId,
    });
    if (!result) {
      throw new ForbiddenException();
    }
  }
}
