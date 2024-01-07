import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CryptoService {
  constructor() {}

  hashData(data: any) {
    return bcrypt.hash(data, 10);
  }

  compareData(data: any, encrypted: string) {
    return bcrypt.compare(data, encrypted);
  }
}
