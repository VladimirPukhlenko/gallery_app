import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { AddImageDto } from './dto/add-image.dto';
import { UsersService } from 'src/users/users.service';
import { Image } from '../schemas/Image.schema';
import { InjectModel } from '@nestjs/mongoose';
import { HydratedDocument, Model, ObjectId } from 'mongoose';
import { getUserImagesArgs } from 'src/types/types';
import { Album } from 'src/schemas/Album.schema';
import { User } from 'src/schemas/User.schema';

@Injectable()
export class ImagesService {
  constructor(
    private usersService: UsersService,
    @InjectModel(Image.name)
    private imageModel: Model<Image>,
    @InjectModel(Album.name)
    private albumModel: Model<Album>,
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getUserImages({
    type,
    albumId,
    page,
    limit,
    userId,
  }: getUserImagesArgs) {
    const query: Record<string, any> = { creator: userId };
    const errors: string[] = [];

    if (albumId && type) {
      errors.push('Invalid parameters');
    }

    if (albumId) {
      const requiredAlbum = await this.albumModel.findById(albumId);
      if (!requiredAlbum) {
        errors.push('Album not found.');
      } else if (requiredAlbum.author.toString() !== userId.toString()) {
        errors.push('You do not have permission to access this album.');
      } else {
        query._id = { $in: requiredAlbum.images };
      }
    }

    if (type === 'favorites') {
      const requiredUser = await this.userModel.findById(userId);
      if (requiredUser) {
        query._id = { $in: requiredUser.favorites };
      } else {
        errors.push('User not found.');
      }
    }

    if (errors.length > 0) {
      throw new BadRequestException(errors.join(' '));
    }

    return await this.paginationService<Image>(
      limit,
      page,
      this.imageModel,
      query,
    );
  }

  async getAllImages({ page, limit }: { page: number; limit: number }) {
    return await this.paginationService<Image>(limit, page, this.imageModel);
  }

  async addImage(addImageDto: AddImageDto, userId: string) {
    const newImage = new this.imageModel({ ...addImageDto, creator: userId });
    await newImage.save();
    await this.usersService.addToImagesArray(userId, newImage._id.toString());
    return newImage;
  }
  async deleteImage(userId: string, imageId: string) {
    const requiredImage = await this.imageModel.findById(imageId);
    if (!requiredImage) {
      throw new NotFoundException();
    }
    if (requiredImage.creator.toString() !== userId) {
      throw new ForbiddenException();
    }
    await this.imageModel.findByIdAndDelete(imageId);
    await this.usersService.removeImageRefs(imageId);
  }

  async paginationService<T>(
    limit: number,
    page: number,
    model: Model<T>,
    query?: Record<string, any>,
  ) {
    const skip = limit * (page - 1);
    const images = await model.find(query).limit(limit).skip(skip);
    const totalItems = await model.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data: images,
    };
  }
}
