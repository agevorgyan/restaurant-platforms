import { Entity, Identifier } from '@saas/domain';

export class WriteOffRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WriteOffRecordId { return new WriteOffRecordId(value); }
  public static generate(): WriteOffRecordId { return new WriteOffRecordId(crypto.randomUUID()); }
}

export class WriteOffRecord extends Entity<WriteOffRecordId> {
  constructor(
    id: WriteOffRecordId,
    public readonly amount: number,
    public readonly reason: string,
    public readonly approverId: string,
    public readonly date: Date
  ) {
    super(id);
    if (amount <= 0) throw new Error('Write off amount must be strictly positive.');
  }

  public static create(amount: number, reason: string, approverId: string): WriteOffRecord {
    return new WriteOffRecord(WriteOffRecordId.generate(), amount, reason, approverId, new Date());
  }
}
