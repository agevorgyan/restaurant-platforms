import { Entity, Identifier } from '@saas/domain';

export class FollowUpReferenceId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): FollowUpReferenceId { return new FollowUpReferenceId(value); }
  public static generate(): FollowUpReferenceId { return new FollowUpReferenceId(crypto.randomUUID()); }
}

export class FollowUpReference extends Entity<FollowUpReferenceId> {
  constructor(
    id: FollowUpReferenceId,
    public readonly scheduledDate: Date,
    public readonly assignedTo: string,
    public readonly description: string,
    public readonly createdAt: Date
  ) {
    super(id);
  }

  public static create(scheduledDate: Date, assignedTo: string, description: string): FollowUpReference {
    return new FollowUpReference(FollowUpReferenceId.generate(), scheduledDate, assignedTo, description, new Date());
  }
}
