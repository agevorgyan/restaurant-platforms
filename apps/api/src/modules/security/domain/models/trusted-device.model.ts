import { TrustedDeviceId, UserId, DeviceFingerprint } from '../value-objects';

export class TrustedDevice {
  constructor(
    public readonly id: TrustedDeviceId,
    public readonly userId: UserId,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly createdAt: Date,
    public lastUsedAt: Date,
    public isActive: boolean = true,
  ) {}

  public touch(timestamp: Date = new Date()): void {
    this.lastUsedAt = timestamp;
  }

  public revoke(): void {
    this.isActive = false;
  }
}
