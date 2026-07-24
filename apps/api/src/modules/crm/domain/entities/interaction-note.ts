import { Entity, Identifier } from '@saas/domain';

export class InteractionNoteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InteractionNoteId { return new InteractionNoteId(value); }
  public static generate(): InteractionNoteId { return new InteractionNoteId(crypto.randomUUID()); }
}

export class InteractionNote extends Entity<InteractionNoteId> {
  constructor(
    id: InteractionNoteId,
    public readonly authorId: string,
    public readonly content: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(authorId: string, content: string): InteractionNote {
    if (!content || content.trim().length === 0) throw new Error('Note content cannot be empty.');
    return new InteractionNote(InteractionNoteId.generate(), authorId, content, new Date());
  }
}
