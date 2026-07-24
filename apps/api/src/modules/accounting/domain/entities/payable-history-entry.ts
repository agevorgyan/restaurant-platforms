import { Entity, Identifier } from '@saas/domain';

export class PayableHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayableHistoryEntryId { return new PayableHistoryEntryId(value); }
  public static generate(): PayableHistoryEntryId { return new PayableHistoryEntryId(crypto.randomUUID()); }
}

export class PayableHistoryEntry extends Entity<PayableHistoryEntryId> {
  constructor(
    id: PayableHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): PayableHistoryEntry {
    return new PayableHistoryEntry(PayableHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
