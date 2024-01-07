import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { MailerModule } from '@nestjs-modules/mailer';

import { UsersModule } from './users/users.module';
import { ImagesModule } from './images/images.module';
import { AuthModule } from './auth/auth.module';
import { AlbumsModule } from './albums/albums.module';
import { mailerConfig } from './configs/mailer.config';
import { env } from './configs/env.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [env],
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get('DB.MONGODB_URL'),
      }),
    }),
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: mailerConfig,
    }),
    AuthModule,
    UsersModule,
    ImagesModule,
    AlbumsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
