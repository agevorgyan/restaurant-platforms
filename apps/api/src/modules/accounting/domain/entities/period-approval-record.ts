import { Entity, Identifier } from '@saas/domain';

export class PeriodApprovalRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PeriodApprovalRecordId { return new PeriodApprovalRecordId(value); }
  public static generate(): PeriodApprovalRecordId { return new PeriodApprovalRecordId(crypto.randomUUID()); }
}

export class PeriodApprovalRecord extends Entity<PeriodApprovalRecordId> {
  constructor(
    id: PeriodApprovalRecordId,
    public readonly approverId: string,
    public readonly approvalDate: Date,
    public readonly notes: string,
    public readonly action: string
  ) {
    super(id);
  }

  public static create(approverId: string, action: string, notes: string = ''): PeriodApprovalRecord {
    return new PeriodApprovalRecord(PeriodApprovalRecordId.generate(), approverId, new Date(), notes, action);
  }
}
