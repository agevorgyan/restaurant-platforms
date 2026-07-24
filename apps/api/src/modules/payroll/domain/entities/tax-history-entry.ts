import { Entity, Identifier } from '@saas/domain';

export class TaxHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxHistoryEntryId { return new TaxHistoryEntryId(value); }
  public static generate(): TaxHistoryEntryId { return new TaxHistoryEntryId(crypto.randomUUID()); }
}

export class TaxHistoryEntry extends Entity<TaxHistoryEntryId> {
  constructor(
    id: TaxHistoryEntryId,
    public readonly timestamp: Date,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string): TaxHistoryEntry {
    return new TaxHistoryEntry(
      TaxHistoryEntryId.generate(),
      new Date(),
      action,
      performedBy,
      details
    );
  }
}
