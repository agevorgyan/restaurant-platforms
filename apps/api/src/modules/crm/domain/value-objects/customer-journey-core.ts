import { Identifier, DomainPrimitive } from '@saas/domain';

export class JourneyId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyId { return new JourneyId(value); }
  public static generate(): JourneyId { return new JourneyId(crypto.randomUUID()); }
}

export class JourneyNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyNumber {
    if (!value || value.trim().length === 0) throw new Error('Journey number cannot be empty.');
    return new JourneyNumber(value);
  }
}

export enum JourneyStageEnum {
  ANONYMOUS = 'ANONYMOUS',
  LEAD = 'LEAD',
  QUALIFIED_LEAD = 'QUALIFIED_LEAD',
  OPPORTUNITY = 'OPPORTUNITY',
  CUSTOMER = 'CUSTOMER',
  RETURNING_CUSTOMER = 'RETURNING_CUSTOMER',
  VIP = 'VIP',
  INACTIVE = 'INACTIVE',
  RECOVERED = 'RECOVERED',
  LOST = 'LOST'
}

export class JourneyStage extends DomainPrimitive<JourneyStageEnum> {
  private constructor(value: JourneyStageEnum) { super(value); }
  public static create(value: JourneyStageEnum): JourneyStage {
    if (!Object.values(JourneyStageEnum).includes(value)) throw new Error(`Invalid journey stage: ${value}`);
    return new JourneyStage(value);
  }
}

export enum JourneyStatusEnum {
  ACTIVE = 'ACTIVE',
  PAUSED = 'PAUSED',
  CLOSED = 'CLOSED',
  ARCHIVED = 'ARCHIVED'
}

export class JourneyStatus extends DomainPrimitive<JourneyStatusEnum> {
  private constructor(value: JourneyStatusEnum) { super(value); }
  public static create(value: JourneyStatusEnum): JourneyStatus {
    if (!Object.values(JourneyStatusEnum).includes(value)) throw new Error(`Invalid journey status: ${value}`);
    return new JourneyStatus(value);
  }
}

export class JourneyType extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JourneyType {
    if (!value || value.trim().length === 0) throw new Error('Journey type cannot be empty.');
    return new JourneyType(value);
  }
}

export class CustomerReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CustomerReference {
    if (!value || value.trim().length === 0) throw new Error('Customer reference cannot be empty.');
    return new CustomerReference(value);
  }
}

export class JourneyStartDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): JourneyStartDate {
    return new JourneyStartDate(value);
  }
}

export class JourneyEndDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): JourneyEndDate {
    return new JourneyEndDate(value);
  }
}

export class CurrentMilestone extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CurrentMilestone {
    return new CurrentMilestone(value);
  }
}

export class HealthScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): HealthScore {
    if (value < 0 || value > 100) throw new Error('Health score must be between 0 and 100.');
    return new HealthScore(value);
  }
}

export enum RiskLevelEnum {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class RiskLevel extends DomainPrimitive<RiskLevelEnum> {
  private constructor(value: RiskLevelEnum) { super(value); }
  public static create(value: RiskLevelEnum): RiskLevel {
    if (!Object.values(RiskLevelEnum).includes(value)) throw new Error(`Invalid risk level: ${value}`);
    return new RiskLevel(value);
  }
}
