import { Entity, Identifier } from '@saas/domain';

export class EngagementHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EngagementHistoryEntryId { return new EngagementHistoryEntryId(value); }
  public static generate(): EngagementHistoryEntryId { return new EngagementHistoryEntryId(crypto.randomUUID()); }
}

export class EngagementHistoryEntry extends Entity<EngagementHistoryEntryId> {
  constructor(
    id: EngagementHistoryEntryId,
    public readonly action: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, details: string): EngagementHistoryEntry {
    return new EngagementHistoryEntry(EngagementHistoryEntryId.generate(), action, new Date(), details);
  }
}
