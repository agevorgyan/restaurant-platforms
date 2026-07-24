import { Entity, Identifier } from '@saas/domain';

export class JourneyHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyHistoryEntryId { return new JourneyHistoryEntryId(value); }
  public static generate(): JourneyHistoryEntryId { return new JourneyHistoryEntryId(crypto.randomUUID()); }
}

export class JourneyHistoryEntry extends Entity<JourneyHistoryEntryId> {
  constructor(
    id: JourneyHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string): JourneyHistoryEntry {
    return new JourneyHistoryEntry(JourneyHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
