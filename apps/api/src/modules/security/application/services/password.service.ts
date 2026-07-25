/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';
import { PasswordResetDto, PasswordChangeDto } from '../dto';

@Injectable()
export class PasswordService {
  async resetPassword(dto: PasswordResetDto): Promise<void> {}

  async changePassword(userId: string, dto: PasswordChangeDto): Promise<void> {}
  
  async hashPassword(password: string): Promise<string> {
    return 'hashed';
  }

  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return true;
  }
}
