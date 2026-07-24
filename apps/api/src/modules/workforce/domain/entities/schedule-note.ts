import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class ScheduleNoteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduleNoteId { return new ScheduleNoteId(value); }
  public static generate(): ScheduleNoteId { return new ScheduleNoteId(crypto.randomUUID()); }
}

export class ScheduleNote extends Entity<ScheduleNoteId> {
  constructor(
    id: ScheduleNoteId,
    public readonly authorId: StaffId,
    public readonly content: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(authorId: StaffId, content: string): ScheduleNote {
    if (!content || content.trim().length === 0) {
      throw new Error('Schedule note content cannot be empty.');
    }
    return new ScheduleNote(ScheduleNoteId.generate(), authorId, content, new Date());
  }
}
