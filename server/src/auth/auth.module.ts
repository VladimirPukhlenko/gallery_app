import { Module, forwardRef } from '@nestjs/common';
import { CryptoService } from './services/crypto.service';
import { TokenService } from './services/token.service';
import { RecoveryService } from './services/recovery.service';

import { RegistrationService } from './services/registration.service';
import { LoginService } from './services/login.service';
import { MailService } from './services/mail.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { User, UserSchema } from 'src/schemas/User.schema';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { JwtAccessStrategy } from './strategies/JwtAccessStrategy';
import { JwtRecoveryStrategy } from './strategies/JwtRecoveryStrategy';
import { JwtRefreshStrategy } from './strategies/JwtRefreshStategy';

@Module({
  providers: [
    CryptoService,
    TokenService,
    RecoveryService,
    RegistrationService,
    LoginService,
    MailService,
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    JwtRecoveryStrategy,
  ],
  imports: [
    JwtModule.register({}),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    PassportModule.register({ session: false }),
    forwardRef(() => UsersModule),
  ],
  controllers: [AuthController],
  exports: [CryptoService, JwtAccessStrategy],
})
export class AuthModule {}
