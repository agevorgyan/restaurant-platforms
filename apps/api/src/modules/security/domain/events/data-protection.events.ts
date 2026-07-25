import { SensitiveField, TokenId, PrivacyRequest } from '../value-objects';

/** Emitted when automatic PII detection identifies sensitive data. */
export class SensitiveDataDetected {
  constructor(
    public readonly resourceId: string,
    public readonly resourceType: string,
    public readonly fields: SensitiveField[],
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a field or column is encrypted. */
export class DataEncrypted {
  constructor(
    public readonly resourceId: string,
    public readonly fieldName: string,
    public readonly algorithm: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when data masking is applied to a field. */
export class DataMasked {
  constructor(
    public readonly resourceId: string,
    public readonly fieldName: string,
    public readonly pattern: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a sensitive value is tokenized. */
export class TokenGenerated {
  constructor(
    public readonly tokenId: TokenId,
    public readonly resourceId: string,
    public readonly fieldName: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a retention policy is applied to a data set. */
export class RetentionApplied {
  constructor(
    public readonly resourceId: string,
    public readonly retentionDays: number,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when data is securely deleted. */
export class DataDeleted {
  constructor(
    public readonly resourceId: string,
    public readonly deletionMethod: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a privacy request completes processing. */
export class PrivacyRequestCompleted {
  constructor(
    public readonly requestId: string,
    public readonly subjectId: string,
    public readonly timestamp: Date,
  ) {}
}

/** Emitted when a data protection violation is detected. */
export class DataProtectionViolationDetected {
  constructor(
    public readonly resourceId: string,
    public readonly violationType: string,
    public readonly details: string,
    public readonly timestamp: Date,
  ) {}
}
