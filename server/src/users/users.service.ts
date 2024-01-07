import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { RegistrationUserDto } from 'src/auth/dto/registration-user.dto';
import { CryptoService } from 'src/auth/services/crypto.service';
import { User, UserDocument } from 'src/schemas/User.schema';
import { EditUserDto } from './dto/edit-user.dto';
import { use } from 'passport';
import { CloudinaryService } from 'src/images/services/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
    private cryptoService: CryptoService,
    private cloudinaryService: CloudinaryService,
  ) {}

  findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }
  findById(id: string) {
    return this.userModel.findById(id);
  }
  updateById(userId: string, data: Partial<User>) {
    return this.userModel.findByIdAndUpdate(userId, data);
  }

  async editUser(userId: string, editUserDto: EditUserDto) {
    const user = await this.findById(userId);
    const { cloudinaryId } = user.picture;
    if (cloudinaryId) {
      await this.cloudinaryService.removeImageFromCloud(cloudinaryId);
    }
    return await user.updateOne(editUserDto);
  }

  async createUser(registrationUserDto: RegistrationUserDto) {
    const hashedPassword = await this.cryptoService.hashData(
      registrationUserDto.password,
    );

    const newUser = new this.userModel({
      ...registrationUserDto,
      password: hashedPassword,
    });
    return newUser.save();
  }
}
