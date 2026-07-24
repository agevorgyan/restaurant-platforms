import { Entity, Identifier } from '@saas/domain';

export class OpportunityHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityHistoryEntryId { return new OpportunityHistoryEntryId(value); }
  public static generate(): OpportunityHistoryEntryId { return new OpportunityHistoryEntryId(crypto.randomUUID()); }
}

export class OpportunityHistoryEntry extends Entity<OpportunityHistoryEntryId> {
  constructor(
    id: OpportunityHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): OpportunityHistoryEntry {
    return new OpportunityHistoryEntry(OpportunityHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
