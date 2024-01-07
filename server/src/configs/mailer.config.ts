import { ConfigService } from '@nestjs/config';

export const mailerConfig = async (configService: ConfigService) => ({
  transport: {
    service: 'gmail',
    host: configService.get('MAILER.EMAIL_PORT'),
    port: configService.get('MAILER.EMAIL_PORT'),
    secure: false,
    logger: false,
    debug: false,

    auth: {
      user: configService.get('MAILER.EMAIL_USER'),
      pass: configService.get('MAILER.EMAIL_PASSWORD'),
    },
  },
  defaults: {
    from: `No Reply <${configService.get('MAILER.EMAIL_USER')}>`,
  },
});
