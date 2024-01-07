import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  async removeImageFromCloud(imagePublicId: string) {
    await cloudinary.uploader.destroy(imagePublicId);
  }
}
