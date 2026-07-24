import { Entity, Identifier } from '@saas/domain';

export class LedgerHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LedgerHistoryEntryId { return new LedgerHistoryEntryId(value); }
  public static generate(): LedgerHistoryEntryId { return new LedgerHistoryEntryId(crypto.randomUUID()); }
}

export class LedgerHistoryEntry extends Entity<LedgerHistoryEntryId> {
  constructor(
    id: LedgerHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): LedgerHistoryEntry {
    return new LedgerHistoryEntry(LedgerHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
