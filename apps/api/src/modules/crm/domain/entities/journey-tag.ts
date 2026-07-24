import { Entity, Identifier } from '@saas/domain';

export class JourneyTagId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyTagId { return new JourneyTagId(value); }
  public static generate(): JourneyTagId { return new JourneyTagId(crypto.randomUUID()); }
}

export class JourneyTag extends Entity<JourneyTagId> {
  constructor(
    id: JourneyTagId,
    public readonly tag: string,
    public readonly addedAt: Date
  ) {
    super(id);
  }

  public static create(tag: string): JourneyTag {
    return new JourneyTag(JourneyTagId.generate(), tag, new Date());
  }
}
