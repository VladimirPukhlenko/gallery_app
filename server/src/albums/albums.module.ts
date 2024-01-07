import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsService } from './albums.service';
import { Album, AlbumSchema } from 'src/schemas/Album.schema';
import { AlbumManagementService } from './services/album-management.service';
import { UserAlbumsService } from './services/user-albums.service';
import { UsersModule } from 'src/users/users.module';
import { ImagesModule } from 'src/images/images.module';
import { AlbumsController } from './albums.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    forwardRef(() => ImagesModule),
    AuthModule,
  ],
  providers: [AlbumsService, AlbumManagementService, UserAlbumsService],
  exports: [AlbumsService],
  controllers: [AlbumsController],
})
export class AlbumsModule {}
