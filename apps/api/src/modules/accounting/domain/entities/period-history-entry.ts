import { Entity, Identifier } from '@saas/domain';

export class PeriodHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PeriodHistoryEntryId { return new PeriodHistoryEntryId(value); }
  public static generate(): PeriodHistoryEntryId { return new PeriodHistoryEntryId(crypto.randomUUID()); }
}

export class PeriodHistoryEntry extends Entity<PeriodHistoryEntryId> {
  constructor(
    id: PeriodHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): PeriodHistoryEntry {
    return new PeriodHistoryEntry(PeriodHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
