import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class ShiftNoteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ShiftNoteId { return new ShiftNoteId(value); }
  public static generate(): ShiftNoteId { return new ShiftNoteId(crypto.randomUUID()); }
}

export class ShiftNote extends Entity<ShiftNoteId> {
  constructor(
    id: ShiftNoteId,
    public readonly authorId: StaffId,
    public readonly content: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(authorId: StaffId, content: string): ShiftNote {
    if (!content || content.trim().length === 0) {
      throw new Error('Shift note content cannot be empty.');
    }
    return new ShiftNote(ShiftNoteId.generate(), authorId, content, new Date());
  }
}
