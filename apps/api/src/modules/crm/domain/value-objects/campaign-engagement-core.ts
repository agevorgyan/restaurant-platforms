import { Identifier, DomainPrimitive } from '@saas/domain';

export class CampaignEngagementId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CampaignEngagementId { return new CampaignEngagementId(value); }
  public static generate(): CampaignEngagementId { return new CampaignEngagementId(crypto.randomUUID()); }
}

export class CampaignReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CampaignReference {
    if (!value || value.trim().length === 0) throw new Error('Campaign reference cannot be empty.');
    return new CampaignReference(value);
  }
}

export class TargetReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TargetReference {
    if (!value || value.trim().length === 0) throw new Error('Target reference cannot be empty.');
    return new TargetReference(value);
  }
}

export enum EngagementStatusEnum {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export class EngagementStatus extends DomainPrimitive<EngagementStatusEnum> {
  private constructor(value: EngagementStatusEnum) { super(value); }
  public static create(value: EngagementStatusEnum): EngagementStatus {
    if (!Object.values(EngagementStatusEnum).includes(value)) throw new Error(`Invalid engagement status: ${value}`);
    return new EngagementStatus(value);
  }
}

export class EngagementScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): EngagementScore {
    if (value < 0) throw new Error('Engagement score cannot be negative.');
    return new EngagementScore(value);
  }
}

export class FirstEngagementAt extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): FirstEngagementAt {
    return new FirstEngagementAt(value);
  }
}

export class LastEngagementAt extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): LastEngagementAt {
    return new LastEngagementAt(value);
  }
}

export enum ConversionStatusEnum {
  NOT_CONVERTED = 'NOT_CONVERTED',
  CONVERTED = 'CONVERTED'
}

export class ConversionStatus extends DomainPrimitive<ConversionStatusEnum> {
  private constructor(value: ConversionStatusEnum) { super(value); }
  public static create(value: ConversionStatusEnum): ConversionStatus {
    if (!Object.values(ConversionStatusEnum).includes(value)) throw new Error(`Invalid conversion status: ${value}`);
    return new ConversionStatus(value);
  }
}
