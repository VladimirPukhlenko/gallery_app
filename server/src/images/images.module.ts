import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ImagesService } from './images.service';
import { ImagesController } from './images.controller';
import { UserImagesService } from './services/user-images.service';
import { ImageManagementService } from './services/image-management.service';
import { ImageSchema, Image } from 'src/schemas/Image.schema';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { AlbumsModule } from 'src/albums/albums.module';
import { CloudinaryService } from './services/cloudinary.service';
import { CloudinaryProvider } from './providers/cloudinary.provider';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    forwardRef(() => AlbumsModule),
    AuthModule,
    forwardRef(() => UsersModule),
  ],
  providers: [
    ImagesService,
    UserImagesService,
    ImageManagementService,
    CloudinaryService,
    CloudinaryProvider,
  ],
  controllers: [ImagesController],
  exports: [CloudinaryService],
})
export class ImagesModule {}
