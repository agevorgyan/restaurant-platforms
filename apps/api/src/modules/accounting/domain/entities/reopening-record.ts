import { Entity, Identifier } from '@saas/domain';

export class ReopeningRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReopeningRecordId { return new ReopeningRecordId(value); }
  public static generate(): ReopeningRecordId { return new ReopeningRecordId(crypto.randomUUID()); }
}

export class ReopeningRecord extends Entity<ReopeningRecordId> {
  constructor(
    id: ReopeningRecordId,
    public readonly reopenedBy: string,
    public readonly reopenDate: Date,
    public readonly reason: string,
    public readonly approvalId: string
  ) {
    super(id);
  }

  public static create(reopenedBy: string, reason: string, approvalId: string): ReopeningRecord {
    return new ReopeningRecord(ReopeningRecordId.generate(), reopenedBy, new Date(), reason, approvalId);
  }
}
