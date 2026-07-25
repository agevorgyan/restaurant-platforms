import {
  AuditRecordId,
  ComplianceReportId,
  EvidenceReference,
} from '../value-objects';

export class AuditRecorded {
  constructor(
    public readonly auditId: AuditRecordId,
    public readonly timestamp: Date,
  ) {}
}

export class SecurityEventRecorded {
  constructor(
    public readonly auditId: AuditRecordId,
    public readonly severity: string,
    public readonly timestamp: Date,
  ) {}
}

export class ComplianceReportGenerated {
  constructor(
    public readonly reportId: ComplianceReportId,
    public readonly framework: string,
    public readonly timestamp: Date,
  ) {}
}

export class RetentionPolicyApplied {
  constructor(
    public readonly auditId: AuditRecordId,
    public readonly expirationDate: Date,
    public readonly timestamp: Date,
  ) {}
}

export class AuditArchived {
  constructor(
    public readonly auditId: AuditRecordId,
    public readonly timestamp: Date,
  ) {}
}

export class AuditExported {
  constructor(
    public readonly auditIds: AuditRecordId[],
    public readonly exportedBy: string,
    public readonly timestamp: Date,
  ) {}
}

export class EvidenceCollected {
  constructor(
    public readonly reportId: ComplianceReportId,
    public readonly evidence: EvidenceReference,
    public readonly timestamp: Date,
  ) {}
}
