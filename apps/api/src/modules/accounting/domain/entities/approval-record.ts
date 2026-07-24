import { Entity, Identifier } from '@saas/domain';

export class ApprovalRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ApprovalRecordId { return new ApprovalRecordId(value); }
  public static generate(): ApprovalRecordId { return new ApprovalRecordId(crypto.randomUUID()); }
}

export class ApprovalRecord extends Entity<ApprovalRecordId> {
  constructor(
    id: ApprovalRecordId,
    public readonly approverId: string,
    public readonly approvalDate: Date,
    public readonly notes: string,
    public readonly isApproved: boolean
  ) {
    super(id);
  }

  public static create(approverId: string, isApproved: boolean, notes: string = ''): ApprovalRecord {
    return new ApprovalRecord(ApprovalRecordId.generate(), approverId, new Date(), notes, isApproved);
  }
}
