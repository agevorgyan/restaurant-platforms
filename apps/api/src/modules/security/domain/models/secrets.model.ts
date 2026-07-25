import {
  SecretId,
  SecretVersionId,
  SecretValue,
  KeyId,
  KeyVersion,
  CertificateId,
  CertificateFingerprint,
  CertificateExpiration,
  RotationPolicy,
} from '../value-objects';
import { SecretStatus, KeyAlgorithm } from '../enums/secrets.enums';

export class Secret {
  constructor(
    public readonly id: SecretId,
    public readonly name: string,
    public readonly type: string,
    public status: SecretStatus,
    public currentVersionId: SecretVersionId,
    public readonly rotationPolicy?: RotationPolicy,
    public readonly description?: string,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public rotate(newVersionId: SecretVersionId): void {
    this.currentVersionId = newVersionId;
    this.updatedAt = new Date();
  }

  public revoke(): void {
    this.status = SecretStatus.Revoked;
    this.updatedAt = new Date();
  }
}

export class EncryptionKey {
  constructor(
    public readonly id: KeyId,
    public readonly algorithm: KeyAlgorithm,
    public currentVersion: KeyVersion,
    public readonly isExportable: boolean,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public rotate(newVersion: KeyVersion): void {
    this.currentVersion = newVersion;
    this.updatedAt = new Date();
  }
}

export class Certificate {
  constructor(
    public readonly id: CertificateId,
    public readonly fingerprint: CertificateFingerprint,
    public readonly subject: string,
    public readonly issuer: string,
    public expiration: CertificateExpiration,
    public isActive: boolean = true,
    public readonly createdAt: Date = new Date(),
    public updatedAt: Date = new Date(),
  ) {}

  public renew(newExpiration: CertificateExpiration): void {
    this.expiration = newExpiration;
    this.updatedAt = new Date();
  }

  public revoke(): void {
    this.isActive = false;
    this.updatedAt = new Date();
  }
}
