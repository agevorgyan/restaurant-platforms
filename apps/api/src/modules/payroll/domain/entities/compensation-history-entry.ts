import { Entity, Identifier } from '@saas/domain';

export class CompensationHistoryEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CompensationHistoryEntryId { return new CompensationHistoryEntryId(value); }
  public static generate(): CompensationHistoryEntryId { return new CompensationHistoryEntryId(crypto.randomUUID()); }
}

export class CompensationHistoryEntry extends Entity<CompensationHistoryEntryId> {
  constructor(
    id: CompensationHistoryEntryId,
    public readonly timestamp: Date,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly previousState: string,
    public readonly newState: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, previousState: string, newState: string): CompensationHistoryEntry {
    return new CompensationHistoryEntry(
      CompensationHistoryEntryId.generate(),
      new Date(),
      action,
      performedBy,
      previousState,
      newState
    );
  }
}
