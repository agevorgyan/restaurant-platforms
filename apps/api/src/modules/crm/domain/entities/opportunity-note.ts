import { Entity, Identifier } from '@saas/domain';

export class OpportunityNoteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityNoteId { return new OpportunityNoteId(value); }
  public static generate(): OpportunityNoteId { return new OpportunityNoteId(crypto.randomUUID()); }
}

export class OpportunityNote extends Entity<OpportunityNoteId> {
  constructor(
    id: OpportunityNoteId,
    public readonly authorId: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(authorId: string, content: string): OpportunityNote {
    if (!content || content.trim().length === 0) throw new Error('Note content cannot be empty.');
    return new OpportunityNote(OpportunityNoteId.generate(), authorId, content, new Date());
  }
}
