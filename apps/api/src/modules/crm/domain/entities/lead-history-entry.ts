import { Entity, Identifier } from '@saas/domain';

export class LeadHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadHistoryEntryId { return new LeadHistoryEntryId(value); }
  public static generate(): LeadHistoryEntryId { return new LeadHistoryEntryId(crypto.randomUUID()); }
}

export class LeadHistoryEntry extends Entity<LeadHistoryEntryId> {
  constructor(
    id: LeadHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): LeadHistoryEntry {
    return new LeadHistoryEntry(LeadHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
