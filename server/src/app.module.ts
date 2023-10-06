import { Module, UseGuards } from '@nestjs/common';

import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { TokensModule } from './tokens/tokens.module';
import { ImagesModule } from './images/images.module';
import configuration from './config/configuration';
import { MongooseModule } from '@nestjs/mongoose';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    AuthModule,
    UsersModule,
    MailModule,
    TokensModule,
    ImagesModule,
    AlbumsModule,
  ],
})
export class AppModule {}
