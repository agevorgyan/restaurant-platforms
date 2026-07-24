import { Entity, Identifier } from '@saas/domain';

export class InteractionHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionHistoryEntryId { return new InteractionHistoryEntryId(value); }
  public static generate(): InteractionHistoryEntryId { return new InteractionHistoryEntryId(crypto.randomUUID()); }
}

export class InteractionHistoryEntry extends Entity<InteractionHistoryEntryId> {
  constructor(
    id: InteractionHistoryEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string = ''): InteractionHistoryEntry {
    return new InteractionHistoryEntry(InteractionHistoryEntryId.generate(), action, performedBy, new Date(), details);
  }
}
