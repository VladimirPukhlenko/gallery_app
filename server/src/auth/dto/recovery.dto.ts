import { IsEmail } from 'class-validator';

export class RecoveryDto {
  @IsEmail()
  readonly email: string;
}
