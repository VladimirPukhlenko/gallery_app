import { Injectable, NotFoundException } from '@nestjs/common';
import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

import { AddImageDto } from '../dto/add-image.dto';
import { Image, ImageDocument } from 'src/schemas/Image.schema';
import { UsersService } from 'src/users/users.service';
import { CloudinaryService } from './cloudinary.service';

@Injectable()
export class ImageManagementService {
  constructor(
    @InjectModel(Image.name)
    private imageModel: Model<ImageDocument>,
    private usersService: UsersService,
    private cloudinaryService: CloudinaryService,
  ) {}
  async addImage(addImageDto: AddImageDto, userId: string) {
    return this.imageModel.create({
      ...addImageDto,
      creator: userId,
    });
  }

  async deleteImage(userId: string, imageId: string) {
    const image = await this.imageModel.findOne({
      _id: imageId,
      creator: userId,
    });

    if (!image) {
      return new NotFoundException(
        "Image not found. Current user doesn't have this image.",
      );
    }
    await image.deleteOne();
    await this.cloudinaryService.removeImageFromCloud(image.cloudinaryId);
  }

  async favoritesImagesToggle(userId: string, imageId: string) {
    const user = await this.usersService.findById(userId);

    const index = user.favorites.findIndex(
      (item) => item.toHexString() === imageId,
    );
    if (index === -1) {
      const image_id = new Types.ObjectId(imageId);
      user.favorites.push(image_id);
    } else {
      user.favorites.splice(index, 1);
    }
    await user.save();
  }
}
