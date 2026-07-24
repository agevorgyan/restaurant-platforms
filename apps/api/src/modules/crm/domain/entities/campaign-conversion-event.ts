import { Entity, Identifier } from '@saas/domain';

export class ConversionEventId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ConversionEventId { return new ConversionEventId(value); }
  public static generate(): ConversionEventId { return new ConversionEventId(crypto.randomUUID()); }
}

export class ConversionEvent extends Entity<ConversionEventId> {
  constructor(
    id: ConversionEventId,
    public readonly conversionType: string,
    public readonly value: number,
    public readonly currency: string,
    public readonly timestamp: Date,
    public readonly relatedEntityId?: string
  ) {
    super(id);
  }

  public static create(conversionType: string, value: number, currency: string, relatedEntityId?: string): ConversionEvent {
    return new ConversionEvent(ConversionEventId.generate(), conversionType, value, currency, new Date(), relatedEntityId);
  }
}
