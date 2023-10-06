import { Module } from '@nestjs/common';
import { AlbumsController } from './albums.controller';
import { AlbumsService } from './albums.service';
import { JwtAccessStrategy } from 'src/strategies/JwtAccessStrategy';
import { UsersModule } from 'src/users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { Image, ImageSchema } from 'src/schemas/Image.schema';
import { Album, AlbumSchema } from 'src/schemas/Album.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    ConfigModule,
  ],
  controllers: [AlbumsController],
  providers: [AlbumsService, JwtAccessStrategy],
  exports: [AlbumsService],
})
export class AlbumsModule {}
