import { JwtPayloadRecovery } from 'src/auth/strategies/JwtRecoveryStrategy';
import { JwtPayload } from './JwtPayload.interface';

export interface AuthorizedRequest extends Request {
  user: JwtPayload;
}

export interface RecoveryRequest extends Request {
  user: JwtPayloadRecovery;
}
