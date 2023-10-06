import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtGuardRecovery extends AuthGuard('jwt-recovery') {}
