import { IsEmail } from 'class-validator';

export class RecoveryDto {
  @IsEmail({}, { message: 'Please enter a valid email address' })
  readonly email: string;
}
