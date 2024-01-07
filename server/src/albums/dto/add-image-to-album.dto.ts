import { IsNotEmpty } from 'class-validator';

export class AddImageToAlbumDto {
  @IsNotEmpty()
  readonly imageId: string;
}
