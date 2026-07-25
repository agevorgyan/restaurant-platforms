import {
  AuditRecordId,
  AuditCategory,
  AuditActor,
  AuditResource,
  AuditAction,
  AuditResult,
  ComplianceReportId,
  EvidenceReference,
} from '../value-objects';
import { AuditSeverity, AuditStatus } from '../enums/audit.enums';

export class AuditRecord {
  constructor(
    public readonly id: AuditRecordId,
    public readonly category: AuditCategory,
    public readonly severity: AuditSeverity,
    public readonly actor: AuditActor,
    public readonly resource: AuditResource,
    public readonly action: AuditAction,
    public readonly result: AuditResult,
    public readonly timestamp: Date,
    public status: AuditStatus = AuditStatus.Recorded,
    public readonly previousRecordHash?: string,
    public currentRecordHash?: string,
  ) {}

  public setHash(hash: string): void {
    if (this.currentRecordHash) {
      throw new Error('Audit record is immutable and hash is already set.');
    }
    this.currentRecordHash = hash;
  }

  public archive(): void {
    this.status = AuditStatus.Archived;
  }
}

export class ComplianceReport {
  constructor(
    public readonly id: ComplianceReportId,
    public readonly framework: string,
    public readonly generatedAt: Date,
    public readonly generatedBy: string,
    public readonly periodStart: Date,
    public readonly periodEnd: Date,
    public evidences: EvidenceReference[] = [],
  ) {}

  public addEvidence(evidence: EvidenceReference): void {
    this.evidences.push(evidence);
  }
}

export class AuditEvidence {
  constructor(
    public readonly reference: EvidenceReference,
    public readonly description: string,
    public readonly collectedAt: Date,
    public readonly hashValue: string,
  ) {}
}
