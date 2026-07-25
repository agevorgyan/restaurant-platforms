export class AuditRecordId {
  constructor(public readonly value: string) {}
}

export class AuditEventId {
  constructor(public readonly value: string) {}
}

export class AuditCategory {
  constructor(public readonly value: string) {}
}

export class AuditActor {
  constructor(
    public readonly id: string,
    public readonly type: string,
    public readonly ipAddress?: string,
    public readonly userAgent?: string,
  ) {}
}

export class AuditResource {
  constructor(
    public readonly id: string,
    public readonly type: string,
  ) {}
}

export class AuditAction {
  constructor(public readonly value: string) {}
}

export class AuditResult {
  constructor(
    public readonly status: string,
    public readonly reason?: string,
  ) {}
}

export class AuditTimestamp {
  constructor(public readonly value: Date) {}
}

export class ComplianceReportId {
  constructor(public readonly value: string) {}
}

export class EvidenceReference {
  constructor(
    public readonly id: string,
    public readonly url: string,
  ) {}
}

export class RetentionPolicy {
  constructor(
    public readonly durationDays: number,
    public readonly isArchivable: boolean,
  ) {}
}
