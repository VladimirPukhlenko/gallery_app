import { Request } from 'express';
import { ObjectId } from 'mongoose';
import { JwtPayload } from 'src/strategies/JwtAccessStrategy';
import { JwtPayloadRecovery } from 'src/strategies/JwtRecoveryStrategy';
export interface AuthorizedRequest extends Request {
  user: JwtPayload;
}

export interface RecoveryRequest extends Request {
  user: JwtPayloadRecovery;
}

export interface getUserImagesArgs {
  albumId: string;
  type: string;
  userId: string;
  page: number;
  limit: number;
}
export interface getAllUserAlbumsArgs {
  userId: string;
  page: number;
  limit: number;
}
export interface updateAlbumImagesArgs {
  albumId: string;
  userId: string;
  imageId: string;
  action: 'add' | 'delete';
}
