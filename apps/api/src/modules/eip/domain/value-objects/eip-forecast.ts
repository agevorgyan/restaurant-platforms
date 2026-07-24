import { Identifier, DomainPrimitive } from '@saas/domain';

export class ForecastId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ForecastId { return new ForecastId(value); }
  public static generate(): ForecastId { return new ForecastId(crypto.randomUUID()); }
}

export enum ForecastTypeEnum {
  REVENUE = 'REVENUE',
  SALES = 'SALES',
  ORDER = 'ORDER',
  RESERVATION = 'RESERVATION',
  INVENTORY_DEMAND = 'INVENTORY_DEMAND',
  PURCHASING = 'PURCHASING',
  KITCHEN_CAPACITY = 'KITCHEN_CAPACITY',
  LABOR_DEMAND = 'LABOR_DEMAND',
  CASH_FLOW = 'CASH_FLOW',
  CUSTOMER_GROWTH = 'CUSTOMER_GROWTH',
  MARKETING = 'MARKETING'
}

export class ForecastType extends DomainPrimitive<ForecastTypeEnum> {
  private constructor(value: ForecastTypeEnum) { super(value); }
  public static create(value: ForecastTypeEnum): ForecastType {
    if (!Object.values(ForecastTypeEnum).includes(value)) throw new Error(`Invalid ForecastType: ${value}`);
    return new ForecastType(value);
  }
}

export enum ForecastPeriodEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export class ForecastPeriod extends DomainPrimitive<ForecastPeriodEnum> {
  private constructor(value: ForecastPeriodEnum) { super(value); }
  public static create(value: ForecastPeriodEnum): ForecastPeriod {
    if (!Object.values(ForecastPeriodEnum).includes(value)) throw new Error(`Invalid ForecastPeriod: ${value}`);
    return new ForecastPeriod(value);
  }
}

export class ForecastHorizon extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ForecastHorizon {
    if (value <= 0) throw new Error('ForecastHorizon must be greater than zero.');
    return new ForecastHorizon(value);
  }
}

export class ForecastConfidence extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ForecastConfidence {
    if (value < 0 || value > 100) throw new Error('ForecastConfidence must be between 0 and 100.');
    return new ForecastConfidence(value);
  }
}

export class ForecastVersion extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ForecastVersion {
    if (value <= 0) throw new Error('ForecastVersion must be greater than zero.');
    return new ForecastVersion(value);
  }
}

export enum ForecastStrategyEnum {
  MOVING_AVERAGE = 'MOVING_AVERAGE',
  WEIGHTED_MOVING_AVERAGE = 'WEIGHTED_MOVING_AVERAGE',
  EXPONENTIAL_SMOOTHING = 'EXPONENTIAL_SMOOTHING',
  LINEAR_REGRESSION = 'LINEAR_REGRESSION',
  SEASONALITY = 'SEASONALITY',
  MANUAL_PROJECTION = 'MANUAL_PROJECTION',
  AI_STRATEGY = 'AI_STRATEGY'
}

export class ForecastStrategy extends DomainPrimitive<ForecastStrategyEnum> {
  private constructor(value: ForecastStrategyEnum) { super(value); }
  public static create(value: ForecastStrategyEnum): ForecastStrategy {
    if (!Object.values(ForecastStrategyEnum).includes(value)) throw new Error(`Invalid ForecastStrategy: ${value}`);
    return new ForecastStrategy(value);
  }
}

export enum ForecastStatusEnum {
  CALCULATING = 'CALCULATING',
  READY = 'READY',
  FAILED = 'FAILED',
  ARCHIVED = 'ARCHIVED'
}

export class ForecastStatus extends DomainPrimitive<ForecastStatusEnum> {
  private constructor(value: ForecastStatusEnum) { super(value); }
  public static create(value: ForecastStatusEnum): ForecastStatus {
    if (!Object.values(ForecastStatusEnum).includes(value)) throw new Error(`Invalid ForecastStatus: ${value}`);
    return new ForecastStatus(value);
  }
}
