import { IsEmail, IsNotEmpty } from 'class-validator';

export class AddImageDto {
  @IsNotEmpty()
  readonly link: string;
}
