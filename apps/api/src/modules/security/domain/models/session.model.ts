import {
  SessionId,
  UserId,
  IpAddress,
  DeviceFingerprint,
} from '../value-objects';

export class Session {
  private _isActive: boolean;
  private _revokedAt?: Date;

  constructor(
    public readonly id: SessionId,
    public readonly userId: UserId,
    public readonly ipAddress: IpAddress,
    public readonly deviceFingerprint: DeviceFingerprint,
    public readonly createdAt: Date,
    public readonly expiresAt: Date,
    public lastAccessedAt: Date,
  ) {
    this._isActive = true;
  }

  public revoke(timestamp: Date = new Date()): void {
    this._isActive = false;
    this._revokedAt = timestamp;
  }

  public touch(timestamp: Date = new Date()): void {
    this.lastAccessedAt = timestamp;
  }

  get isActive(): boolean {
    return this._isActive && this.expiresAt > new Date();
  }

  get revokedAt(): Date | undefined {
    return this._revokedAt;
  }
}
