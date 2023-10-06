import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import configService from '../config/configuration';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { JwtAccessStrategy } from 'src/strategies/JwtAccessStrategy';
import { PassportModule } from '@nestjs/passport';
import { Album, AlbumSchema } from 'src/schemas/Album.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    ConfigModule,
  ],
  providers: [UsersService, UsersRepository, JwtAccessStrategy],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
