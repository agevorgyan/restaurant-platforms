import { Entity, Identifier } from '@saas/domain';

export class ClosingRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ClosingRecordId { return new ClosingRecordId(value); }
  public static generate(): ClosingRecordId { return new ClosingRecordId(crypto.randomUUID()); }
}

export class ClosingRecord extends Entity<ClosingRecordId> {
  constructor(
    id: ClosingRecordId,
    public readonly closedBy: string,
    public readonly closeDate: Date,
    public readonly closingJournalId: string,
    public readonly notes: string
  ) {
    super(id);
  }

  public static create(closedBy: string, closingJournalId: string, notes: string = ''): ClosingRecord {
    return new ClosingRecord(ClosingRecordId.generate(), closedBy, new Date(), closingJournalId, notes);
  }
}
