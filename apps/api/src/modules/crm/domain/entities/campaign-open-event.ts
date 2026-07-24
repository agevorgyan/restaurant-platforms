import { Entity, Identifier } from '@saas/domain';

export class OpenEventId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpenEventId { return new OpenEventId(value); }
  public static generate(): OpenEventId { return new OpenEventId(crypto.randomUUID()); }
}

export class OpenEvent extends Entity<OpenEventId> {
  constructor(
    id: OpenEventId,
    public readonly timestamp: Date,
    public readonly userAgent: string,
    public readonly ipAddress?: string
  ) {
    super(id);
  }

  public static create(userAgent: string, ipAddress?: string): OpenEvent {
    return new OpenEvent(OpenEventId.generate(), new Date(), userAgent, ipAddress);
  }
}
