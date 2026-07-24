import { Entity, Identifier } from '@saas/domain';

export class AttendanceAuditEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttendanceAuditEntryId { return new AttendanceAuditEntryId(value); }
  public static generate(): AttendanceAuditEntryId { return new AttendanceAuditEntryId(crypto.randomUUID()); }
}

export class AttendanceAuditEntry extends Entity<AttendanceAuditEntryId> {
  constructor(
    id: AttendanceAuditEntryId,
    public readonly action: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, details: string): AttendanceAuditEntry {
    return new AttendanceAuditEntry(AttendanceAuditEntryId.generate(), action, new Date(), details);
  }
}
