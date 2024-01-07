import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from 'src/schemas/Album.schema';

@Injectable()
export class UserAlbumsService {
  constructor(
    @InjectModel(Album.name)
    private albumModel: Model<AlbumDocument>,
  ) {}

  async getAllUserAlbums(
    page: number,
    limit: number,
    userId: string,
    populate: boolean,
    populateLimit: number,
  ) {
    const skip = limit * (page - 1);
    const totalItems = await this.albumModel.countDocuments({ author: userId });
    const totalPages = Math.ceil(totalItems / limit);

    const data = await this.albumModel
      .find({ author: userId })
      .sort({ createdAt: 'descending' })
      .skip(skip)
      .limit(limit)
      .populate(
        populate
          ? {
              path: 'images',
              options: {
                sort: { _id: -1 },
                limit: populateLimit,
              },
            }
          : null,
      );
    return {
      currentPage: page,
      totalPages,
      totalItems,
      data,
    };
  }

  async getSingleUserAlbum(albumId: string, userId: string) {
    const requredAlbum = await this.albumModel.findOne({
      _id: albumId,
      author: userId,
    });
    requredAlbum.toJSON();
    return requredAlbum;
  }
}
