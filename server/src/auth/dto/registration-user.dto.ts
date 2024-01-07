import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class RegistrationUserDto {
  @IsNotEmpty({ message: 'FullName field cannot be empty' })
  readonly fullName: string;
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;
  @MinLength(5, {
    message: 'The minimum length of a password should be at least 5 symbols',
  })
  readonly password: string;
}
