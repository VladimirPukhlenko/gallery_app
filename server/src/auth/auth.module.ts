import { Module, forwardRef } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from 'src/users/users.module';
import { ConfigModule } from '@nestjs/config';
import configService from '../config/configuration';
import { JwtAccessStrategy } from 'src/strategies/JwtAccessStrategy';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from 'src/strategies/JwtRefreshStategy';
import { MailModule } from 'src/mail/mail.module';
import { JwtRecoveryStrategy } from 'src/strategies/JwtRecoveryStrategy';
import { TokensModule } from 'src/tokens/tokens.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/schemas/User.schema';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({}),
    PassportModule.register({ session: false }),
    forwardRef(() => UsersModule),
    MailModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtRecoveryStrategy,
  ],
  exports: [],
})
export class AuthModule {}
