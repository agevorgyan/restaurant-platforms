import { Entity, Identifier } from '@saas/domain';

export class UnsubscribeRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): UnsubscribeRecordId { return new UnsubscribeRecordId(value); }
  public static generate(): UnsubscribeRecordId { return new UnsubscribeRecordId(crypto.randomUUID()); }
}

export class UnsubscribeRecord extends Entity<UnsubscribeRecordId> {
  constructor(
    id: UnsubscribeRecordId,
    public readonly reason: string,
    public readonly timestamp: Date,
    public readonly feedback?: string
  ) {
    super(id);
  }

  public static create(reason: string, feedback?: string): UnsubscribeRecord {
    return new UnsubscribeRecord(UnsubscribeRecordId.generate(), reason, new Date(), feedback);
  }
}
