import { IsNotEmpty } from 'class-validator';

export class AddImageDto {
  @IsNotEmpty({ message: 'Link field cannot be empty' })
  readonly link: string;
  @IsNotEmpty({ message: 'CloudinaryId field cannot be empty' })
  readonly cloudinaryId: string;
}
