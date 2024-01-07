import { MinLength } from 'class-validator';

export class RecoveryConfirmDto {
  @MinLength(5, {
    message: 'The minimum length of a password should be at least 5 symbols',
  })
  readonly password: string;
  @MinLength(5, {
    message: 'The minimum length of a key should be at least 5 symbols',
  })
  readonly key: string;
}
