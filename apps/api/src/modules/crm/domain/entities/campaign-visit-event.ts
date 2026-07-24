import { Entity, Identifier } from '@saas/domain';

export class VisitEventId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): VisitEventId { return new VisitEventId(value); }
  public static generate(): VisitEventId { return new VisitEventId(crypto.randomUUID()); }
}

export class VisitEvent extends Entity<VisitEventId> {
  constructor(
    id: VisitEventId,
    public readonly pageUrl: string,
    public readonly timestamp: Date,
    public readonly durationSeconds: number,
    public readonly referrer?: string
  ) {
    super(id);
  }

  public static create(pageUrl: string, durationSeconds: number, referrer?: string): VisitEvent {
    return new VisitEvent(VisitEventId.generate(), pageUrl, new Date(), durationSeconds, referrer);
  }
}
