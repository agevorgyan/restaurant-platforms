import {
  SecretId,
  SecretVersionId,
  KeyId,
  KeyVersion,
  CertificateId,
  VaultReference,
} from '../value-objects';

export class SecretCreated {
  constructor(
    public readonly secretId: SecretId,
    public readonly versionId: SecretVersionId,
    public readonly timestamp: Date,
  ) {}
}

export class SecretRotated {
  constructor(
    public readonly secretId: SecretId,
    public readonly newVersionId: SecretVersionId,
    public readonly timestamp: Date,
  ) {}
}

export class SecretRevoked {
  constructor(
    public readonly secretId: SecretId,
    public readonly timestamp: Date,
  ) {}
}

export class KeyGenerated {
  constructor(
    public readonly keyId: KeyId,
    public readonly keyVersion: KeyVersion,
    public readonly timestamp: Date,
  ) {}
}

export class KeyRotated {
  constructor(
    public readonly keyId: KeyId,
    public readonly newVersion: KeyVersion,
    public readonly timestamp: Date,
  ) {}
}

export class CertificateIssued {
  constructor(
    public readonly certificateId: CertificateId,
    public readonly timestamp: Date,
  ) {}
}

export class CertificateRenewed {
  constructor(
    public readonly certificateId: CertificateId,
    public readonly timestamp: Date,
  ) {}
}

export class CertificateExpired {
  constructor(
    public readonly certificateId: CertificateId,
    public readonly timestamp: Date,
  ) {}
}

export class VaultSynchronized {
  constructor(
    public readonly vaultRef: VaultReference,
    public readonly timestamp: Date,
  ) {}
}
