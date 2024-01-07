import { ConfigService } from '@nestjs/config';

import { cloudinaryConfig } from 'src/configs/cloudinary.config';

export const CloudinaryProvider = {
  provide: 'cloudinary',
  inject: [ConfigService],
  useFactory: cloudinaryConfig,
};
