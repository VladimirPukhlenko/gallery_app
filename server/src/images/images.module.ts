import { Module } from '@nestjs/common';
import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import configService from '../config/configuration';

import { UsersModule } from 'src/users/users.module';
import { ImageSchema, Image } from 'src/schemas/Image.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAccessStrategy } from 'src/strategies/JwtAccessStrategy';
import { Album, AlbumSchema } from 'src/schemas/Album.schema';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    ConfigModule,
    UsersModule,
  ],
  providers: [ImagesService, JwtAccessStrategy],
  controllers: [ImagesController],
})
export class ImagesModule {}
