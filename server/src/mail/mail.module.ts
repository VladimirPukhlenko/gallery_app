import { MailerModule } from '@nestjs-modules/mailer';

import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import configService from 'src/config/configuration';

@Module({
  imports: [
    ConfigModule.forFeature(configService),
    MailerModule.forRoot({
      transport: {
        service: 'gmail',
        host: process.env.EMAIL_HOST,
        port: +process.env.EMAIL_PORT,
        secure: false,
        logger: false,
        debug: false,

        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      },
      defaults: {
        from: `No Reply <${process.env.EMAIL_USER}>`,
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
