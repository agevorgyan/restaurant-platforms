export class SecretId {
  constructor(public readonly value: string) {}
}

export class SecretVersionId {
  constructor(public readonly value: string) {}
}

export class SecretValue {
  constructor(public readonly value: string) {}
}

export class SecretMetadata {
  constructor(
    public readonly createdBy: string,
    public readonly tags: Record<string, string>,
  ) {}
}

export class KeyId {
  constructor(public readonly value: string) {}
}

export class KeyVersion {
  constructor(public readonly value: string) {}
}

export class KeyUsage {
  constructor(public readonly value: string) {}
}

export class CertificateId {
  constructor(public readonly value: string) {}
}

export class CertificateFingerprint {
  constructor(public readonly value: string) {}
}

export class CertificateExpiration {
  constructor(
    public readonly notBefore: Date,
    public readonly notAfter: Date,
  ) {}
}

export class RotationPolicy {
  constructor(
    public readonly autoRotate: boolean,
    public readonly rotationIntervalDays?: number,
  ) {}
}

export class VaultReference {
  constructor(
    public readonly vaultName: string,
    public readonly path: string,
  ) {}
}
