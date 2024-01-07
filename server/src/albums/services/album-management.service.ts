import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Album, AlbumDocument } from 'src/schemas/Album.schema';

@Injectable()
export class AlbumManagementService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  async createAlbum(name: string, userId: string) {
    const album = await this.albumModel.findOne({
      name,
      author: userId,
    });
    if (album) {
      throw new ConflictException(
        `Album with name "${name}" already exist, please choose another name`,
      );
    }
    const newAlbum = new this.albumModel({
      name,
      author: userId,
    });
    return await newAlbum.save();
  }

  async deleteAlbum(albumId: string, userId: string) {
    const album = await this.albumModel.findOne({
      _id: albumId,
      author: userId,
    });
    if (!album) {
      throw new NotFoundException('There is no such album');
    }
    await album.deleteOne();
  }

  async renameAlbum(albumId: string, userId: string, newName: string) {
    const requredAlbum = await this.albumModel.findOne({
      author: userId,
      _id: albumId,
    });
    const requredAlbumWithSameName = await this.albumModel.findOne({
      author: userId,
      name: newName,
    });

    if (!requredAlbum) {
      throw new NotFoundException(`Album with such id doesn't exist`);
    }
    if (requredAlbumWithSameName) {
      throw new ConflictException(
        `Album with name "${newName}" already exits in your collection`,
      );
    }

    requredAlbum.name = newName;
    return await requredAlbum.save();
  }
  async imagesInAlbumToggle(albumId: string, userId: string, imageId: string) {
    const album = await this.albumModel.findOne({
      _id: albumId,
      author: userId,
    });
    const image_id = new Types.ObjectId(imageId);

    if (!album) {
      throw new NotFoundException('Album with such id not found');
    }
    const includes = album.images.includes(image_id);
    if (includes) {
      album.images = album.images.filter(
        (item) => item.toHexString() !== image_id.toHexString(),
      );
    } else {
      album.images.push(image_id);
    }
    await album.save();
  }
}
