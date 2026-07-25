import {
  DataClassification,
  ProtectionPolicy,
  SensitiveField,
  PrivacyRequest,
} from '../value-objects';
import { ProtectionLevel, PrivacyRequestStatus } from '../enums/data-protection.enums';

/** Aggregate tracking all protection metadata applied to a data resource. */
export class ProtectedDataRecord {
  private _sensitiveFields: SensitiveField[] = [];

  constructor(
    public readonly resourceId: string,
    public readonly resourceType: string,
    public readonly classification: DataClassification,
    public readonly protectionLevel: ProtectionLevel,
    public isEncrypted: boolean = false,
    public isMasked: boolean = false,
    public readonly createdAt: Date = new Date(),
  ) {}

  /** Registers a newly detected sensitive field on this resource. */
  public addSensitiveField(field: SensitiveField): void {
    this._sensitiveFields.push(field);
  }

  /** Marks the resource as encrypted. */
  public markEncrypted(): void {
    this.isEncrypted = true;
  }

  /** Marks the resource as masked. */
  public markMasked(): void {
    this.isMasked = true;
  }

  get sensitiveFields(): ReadonlyArray<SensitiveField> {
    return this._sensitiveFields;
  }
}

/** Aggregate managing the lifecycle of a formal privacy request (GDPR, etc.). */
export class PrivacyRequestRecord {
  private _timeline: Array<{ event: string; at: Date }> = [];

  constructor(
    public readonly request: PrivacyRequest,
    public status: PrivacyRequestStatus = PrivacyRequestStatus.Submitted,
    public readonly createdAt: Date = new Date(),
  ) {
    this._timeline.push({ event: 'Request submitted', at: this.createdAt });
  }

  /** Begins processing the privacy request. */
  public startProcessing(): void {
    this.status = PrivacyRequestStatus.Processing;
    this._timeline.push({ event: 'Processing started', at: new Date() });
  }

  /** Completes the privacy request successfully. */
  public complete(): void {
    this.status = PrivacyRequestStatus.Completed;
    this._timeline.push({ event: 'Request completed', at: new Date() });
  }

  /** Rejects the privacy request with a reason recorded in the timeline. */
  public reject(reason: string): void {
    this.status = PrivacyRequestStatus.Rejected;
    this._timeline.push({ event: `Rejected: ${reason}`, at: new Date() });
  }

  get timeline(): ReadonlyArray<{ event: string; at: Date }> {
    return this._timeline;
  }
}

/** Read-oriented record of classification applied to a resource. */
export class DataClassificationRecord {
  constructor(
    public readonly resourceId: string,
    public readonly resourceType: string,
    public readonly classification: DataClassification,
    public readonly classifiedAt: Date = new Date(),
    public readonly classifiedBy: string = 'system',
  ) {}
}
