import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';
import { UsersController } from './users.controller';
import { ImagesModule } from 'src/images/images.module';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    forwardRef(() => AuthModule),
    AuthModule,
    forwardRef(() => ImagesModule),
  ],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
