import { Entity, Identifier } from '@saas/domain';

export class ReceivableHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReceivableHistoryEntryId { return new ReceivableHistoryEntryId(value); }
  public static generate(): ReceivableHistoryEntryId { return new ReceivableHistoryEntryId(crypto.randomUUID()); }
}

export class ReceivableHistoryEntry extends Entity<ReceivableHistoryEntryId> {
  constructor(
    id: ReceivableHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): ReceivableHistoryEntry {
    return new ReceivableHistoryEntry(ReceivableHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
