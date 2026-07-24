import { Entity, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';

export class AvailabilityCommentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AvailabilityCommentId { return new AvailabilityCommentId(value); }
  public static generate(): AvailabilityCommentId { return new AvailabilityCommentId(crypto.randomUUID()); }
}

export class AvailabilityComment extends Entity<AvailabilityCommentId> {
  constructor(
    id: AvailabilityCommentId,
    public readonly authorId: StaffId,
    public readonly content: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(authorId: StaffId, content: string): AvailabilityComment {
    if (!content || content.trim().length === 0) {
      throw new Error('Comment content cannot be empty.');
    }
    return new AvailabilityComment(AvailabilityCommentId.generate(), authorId, content, new Date());
  }
}
