import { Entity, Identifier } from '@saas/domain';

export class ClickEventId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ClickEventId { return new ClickEventId(value); }
  public static generate(): ClickEventId { return new ClickEventId(crypto.randomUUID()); }
}

export class ClickEvent extends Entity<ClickEventId> {
  constructor(
    id: ClickEventId,
    public readonly linkId: string,
    public readonly url: string,
    public readonly timestamp: Date,
    public readonly userAgent: string,
    public readonly ipAddress?: string
  ) {
    super(id);
  }

  public static create(linkId: string, url: string, userAgent: string, ipAddress?: string): ClickEvent {
    return new ClickEvent(ClickEventId.generate(), linkId, url, new Date(), userAgent, ipAddress);
  }
}
