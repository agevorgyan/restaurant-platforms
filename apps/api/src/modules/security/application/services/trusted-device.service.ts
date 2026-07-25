/* eslint-disable @typescript-eslint/no-unused-vars */import { Injectable } from '@nestjs/common';
import { TrustedDevice } from '../../domain/models';

@Injectable()
export class TrustedDeviceService {
  async registerDevice(userId: string, deviceFingerprint: string): Promise<TrustedDevice> {
    return {} as TrustedDevice;
  }

  async verifyDevice(userId: string, deviceFingerprint: string): Promise<boolean> {
    return true;
  }

  async revokeDevice(deviceId: string): Promise<void> {}
}
