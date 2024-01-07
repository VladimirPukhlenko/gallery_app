import { IsNotEmpty, IsUrl, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PictureDto {
  @IsUrl({}, { message: 'Not a valid picture. Please provide a valid URL.' })
  readonly url: string;
  @IsNotEmpty({ message: 'Please provide a valid cloudinaryId' })
  readonly cloudinaryId: string;
}

export class EditUserDto {
  @ValidateNested()
  @Type(() => PictureDto)
  readonly picture: PictureDto;

  readonly name: string;
}
