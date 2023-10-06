import { IsEmail, MinLength } from 'class-validator';

export class RecoveryConfirmDto {
  @MinLength(5)
  readonly password: string;
  @MinLength(5)
  readonly key: string;
}
