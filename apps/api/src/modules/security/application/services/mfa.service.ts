/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';
import { MfaSetupDto, MfaVerifyDto } from '../dto';

@Injectable()
export class MfaService {
  async setupMfa(userId: string, dto: MfaSetupDto): Promise<any> {
    return { qrCodeUrl: 'dummy' };
  }

  async verifyMfa(userId: string, dto: MfaVerifyDto): Promise<boolean> {
    return true;
  }
}
