import { Entity, Identifier } from '@saas/domain';

export class JournalApprovalRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JournalApprovalRecordId { return new JournalApprovalRecordId(value); }
  public static generate(): JournalApprovalRecordId { return new JournalApprovalRecordId(crypto.randomUUID()); }
}

export class JournalApprovalRecord extends Entity<JournalApprovalRecordId> {
  constructor(
    id: JournalApprovalRecordId,
    public readonly approverId: string,
    public readonly role: string,
    public readonly timestamp: Date,
    public readonly comments: string
  ) {
    super(id);
  }

  public static create(approverId: string, role: string, comments: string = ''): JournalApprovalRecord {
    return new JournalApprovalRecord(JournalApprovalRecordId.generate(), approverId, role, new Date(), comments);
  }
}
