import { IsNotEmpty } from 'class-validator';

export class CreateAlbumDto {
  @IsNotEmpty()
  readonly name: string;
}
