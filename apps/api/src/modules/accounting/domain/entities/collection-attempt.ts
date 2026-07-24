import { Entity, Identifier } from '@saas/domain';

export class CollectionAttemptId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CollectionAttemptId { return new CollectionAttemptId(value); }
  public static generate(): CollectionAttemptId { return new CollectionAttemptId(crypto.randomUUID()); }
}

export class CollectionAttempt extends Entity<CollectionAttemptId> {
  constructor(
    id: CollectionAttemptId,
    public readonly attemptDate: Date,
    public readonly agentId: string,
    public readonly channel: string,
    public readonly notes: string,
    public readonly nextFollowUp: Date | null
  ) {
    super(id);
  }

  public static create(agentId: string, channel: string, notes: string, nextFollowUp: Date | null = null): CollectionAttempt {
    return new CollectionAttempt(CollectionAttemptId.generate(), new Date(), agentId, channel, notes, nextFollowUp);
  }
}
