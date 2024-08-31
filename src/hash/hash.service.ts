import { Injectable } from '@nestjs/common';
import { compareSync, hashSync, genSaltSync } from 'bcrypt';

@Injectable()
export class HashService {
  hashPassword(password: string): string {
    return hashSync(password, genSaltSync(10));
  }

  comparePassword(password: string, hash: string): boolean {
    return compareSync(password, hash);
  }
}
