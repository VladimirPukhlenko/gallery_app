import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { ObjectId } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}
  async findByEmail(email: string) {
    return this.usersRepository.findUserByEmail(email);
  }
  async getAllUsers() {
    return this.usersRepository.getAllUsers();
  }
  async createUser(createUserDto: CreateUserDto) {
    return await this.usersRepository.createUser(createUserDto);
  }
  async findUserById(id: string) {
    return await this.usersRepository.findUserById(id);
  }
  async updateUserPassword(userId: string, password: string) {
    await this.usersRepository.updateUserPassword(userId, password);
  }
  async addToImagesArray(userId: string, imageId: string) {
    await this.usersRepository.addToImagesArray(userId, imageId);
  }
  async updateFavoritesArrayToggle(userId: string, imageId: string) {
    await this.usersRepository.updateFavoritesArrayToggle(userId, imageId);
  }
  async removeImageRefs(imageId: string) {
    await this.usersRepository.removeImageRefs(imageId);
  }
}
