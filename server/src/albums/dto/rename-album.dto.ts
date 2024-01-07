import { IsNotEmpty } from 'class-validator';

export class RenameAlbumDto {
  @IsNotEmpty()
  readonly newName: string;
}
