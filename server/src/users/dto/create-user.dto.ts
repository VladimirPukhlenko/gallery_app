import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  readonly fullName: string;
  @IsEmail()
  readonly email: string;
  @MinLength(5)
  readonly password: string;
}
