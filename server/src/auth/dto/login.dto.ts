import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;
  @IsNotEmpty({ message: 'Password field cannot be empty' })
  readonly password: string;
}
