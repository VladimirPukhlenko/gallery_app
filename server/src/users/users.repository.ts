import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateUserDto } from './dto/create-user.dto';
import { hash } from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Schema, ObjectId } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { Album } from 'src/schemas/Album.schema';
// import

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Album.name)
    private albumModel: Model<Album>, // @InjectModel(Image.name)
  ) // private imageModel: Model<Image>,
  {}

  async findUserByEmail(email: string): Promise<User> {
    return await this.userModel.findOne({ email });
  }
  async findUserById(id: string): Promise<User> {
    return await this.userModel.findById(id);
  }
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.hashData(createUserDto.password);

    const newUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }
  async updateUserPassword(id: string, password: string) {
    const hashedPassword = await this.hashData(password);
    await this.userModel.findByIdAndUpdate(id, { password: hashedPassword });
  }

  async hashData<T extends string | Buffer>(data: T): Promise<string> {
    const hashedData = await hash(data, 10);
    return hashedData;
  }
  async addToImagesArray(userId: string, imageId: string) {
    const user = await this.userModel.findById(userId);

    user.images.push(imageId as unknown as ObjectId);
    return await user.save();
  }
  async updateFavoritesArrayToggle(userId: string, imageId: string) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.favorites.includes(imageId as unknown as ObjectId)) {
      user.favorites = user.favorites.filter(
        (imgId) => imgId.toString() !== imageId.toString(),
      );
    } else {
      user.favorites.push(imageId as unknown as ObjectId);
    }
    return await user.save();
  }
  async getAllUsers() {
    const users = await this.userModel.find().populate('images');
    return users;
  }

  async removeImageRefs(imageId: string) {
    await this.userModel.updateMany(
      { favorites: new Types.ObjectId(imageId) },
      { $pull: { favorites: new Types.ObjectId(imageId) } },
    );

    await this.userModel.updateMany(
      { images: new Types.ObjectId(imageId) },
      { $pull: { images: new Types.ObjectId(imageId) } },
    );
    await this.albumModel.updateMany(
      { images: new Types.ObjectId(imageId) },
      { $pull: { images: new Types.ObjectId(imageId) } },
    );
  }
}
