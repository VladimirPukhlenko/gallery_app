import { ConfigService } from '@nestjs/config';
import { v2 } from 'cloudinary';

export const cloudinaryConfig = async (configService: ConfigService) => {
  return v2.config({
    cloud_name: configService.get('CLOUDINARY.CLOUDINARY_CLOUD_NAME'),
    api_key: configService.get('CLOUDINARY.CLOUDINARY_API_KEY'),
    api_secret: configService.get('CLOUDINARY.CLOUDINARY_API_SECRET'),
  });
};
