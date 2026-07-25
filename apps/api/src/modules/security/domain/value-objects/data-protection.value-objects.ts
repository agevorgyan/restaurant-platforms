import { ProtectionLevel } from '../enums/data-protection.enums';

/** Classification level applied to a data field or entity. */
export class DataClassification {
  constructor(
    public readonly level: string,
    public readonly label: string,
  ) {}
}

/** Policy governing how data of a given classification is protected. */
export class ProtectionPolicy {
  constructor(
    public readonly classification: DataClassification,
    public readonly protectionLevel: ProtectionLevel,
    public readonly encryptionRequired: boolean,
    public readonly maskingRequired: boolean,
  ) {}
}

/** Encryption configuration for a specific field or column. */
export class EncryptionPolicy {
  constructor(
    public readonly algorithm: string,
    public readonly keyReference: string,
    public readonly scope: string,
  ) {}
}

/** Masking configuration per role and tenant. */
export class MaskingPolicy {
  constructor(
    public readonly pattern: string,
    public readonly visibleChars: number,
    public readonly maskChar: string,
  ) {}
}

/** Retention configuration per data classification category. */
export class DataRetentionPolicy {
  constructor(
    public readonly retentionDays: number,
    public readonly archiveAfterDays: number,
    public readonly deleteAfterDays: number,
  ) {}
}

/** Deletion configuration for secure data removal. */
export class DeletionPolicy {
  constructor(
    public readonly method: string,
    public readonly verificationRequired: boolean,
  ) {}
}

/** Opaque identifier for a tokenized value. */
export class TokenId {
  constructor(public readonly value: string) {}
}

/** Represents an encrypted field value with its metadata. */
export class EncryptedField {
  constructor(
    public readonly ciphertext: string,
    public readonly keyReference: string,
    public readonly algorithm: string,
  ) {}
}

/** Marks a field as containing sensitive data. */
export class SensitiveField {
  constructor(
    public readonly fieldName: string,
    public readonly piiType: string,
    public readonly detectedAt: Date,
  ) {}
}

/** Record of detected PII within a resource. */
export class PiiRecord {
  constructor(
    public readonly resourceId: string,
    public readonly resourceType: string,
    public readonly fields: SensitiveField[],
    public readonly detectedAt: Date,
  ) {}
}

/** Formal privacy request (e.g. GDPR data access or deletion). */
export class PrivacyRequest {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly subjectId: string,
    public readonly submittedAt: Date,
  ) {}
}
