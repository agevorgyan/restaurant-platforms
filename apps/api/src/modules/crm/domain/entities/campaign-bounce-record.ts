import { Entity, Identifier } from '@saas/domain';

export class BounceRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BounceRecordId { return new BounceRecordId(value); }
  public static generate(): BounceRecordId { return new BounceRecordId(crypto.randomUUID()); }
}

export class BounceRecord extends Entity<BounceRecordId> {
  constructor(
    id: BounceRecordId,
    public readonly bounceType: 'HARD' | 'SOFT',
    public readonly timestamp: Date,
    public readonly reason: string,
    public readonly code?: string
  ) {
    super(id);
  }

  public static create(bounceType: 'HARD' | 'SOFT', reason: string, code?: string): BounceRecord {
    return new BounceRecord(BounceRecordId.generate(), bounceType, new Date(), reason, code);
  }
}
