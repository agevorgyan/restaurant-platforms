import { Identifier, DomainPrimitive } from '@saas/domain';

export class BenchmarkId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BenchmarkId { return new BenchmarkId(value); }
  public static generate(): BenchmarkId { return new BenchmarkId(crypto.randomUUID()); }
}

export enum BenchmarkTypeEnum {
  RESTAURANT = 'RESTAURANT',
  BRANCH = 'BRANCH',
  REGIONAL = 'REGIONAL',
  FRANCHISE = 'FRANCHISE',
  DEPARTMENT = 'DEPARTMENT',
  EMPLOYEE = 'EMPLOYEE',
  SUPPLIER = 'SUPPLIER',
  MARKETING = 'MARKETING',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL'
}

export class BenchmarkType extends DomainPrimitive<BenchmarkTypeEnum> {
  private constructor(value: BenchmarkTypeEnum) { super(value); }
  public static create(value: BenchmarkTypeEnum): BenchmarkType {
    if (!Object.values(BenchmarkTypeEnum).includes(value)) throw new Error(`Invalid BenchmarkType: ${value}`);
    return new BenchmarkType(value);
  }
}

export enum BenchmarkScopeEnum {
  INTERNAL = 'INTERNAL',
  INDUSTRY = 'INDUSTRY',
  GLOBAL = 'GLOBAL'
}

export class BenchmarkScope extends DomainPrimitive<BenchmarkScopeEnum> {
  private constructor(value: BenchmarkScopeEnum) { super(value); }
  public static create(value: BenchmarkScopeEnum): BenchmarkScope {
    if (!Object.values(BenchmarkScopeEnum).includes(value)) throw new Error(`Invalid BenchmarkScope: ${value}`);
    return new BenchmarkScope(value);
  }
}

export enum BenchmarkPeriodEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY'
}

export class BenchmarkPeriod extends DomainPrimitive<BenchmarkPeriodEnum> {
  private constructor(value: BenchmarkPeriodEnum) { super(value); }
  public static create(value: BenchmarkPeriodEnum): BenchmarkPeriod {
    if (!Object.values(BenchmarkPeriodEnum).includes(value)) throw new Error(`Invalid BenchmarkPeriod: ${value}`);
    return new BenchmarkPeriod(value);
  }
}

export enum BenchmarkMetricEnum {
  REVENUE = 'REVENUE',
  PROFIT = 'PROFIT',
  ORDERS = 'ORDERS',
  AVERAGE_ORDER_VALUE = 'AVERAGE_ORDER_VALUE',
  INVENTORY_TURNOVER = 'INVENTORY_TURNOVER',
  KITCHEN_EFFICIENCY = 'KITCHEN_EFFICIENCY',
  RESERVATION_UTILIZATION = 'RESERVATION_UTILIZATION',
  EMPLOYEE_PRODUCTIVITY = 'EMPLOYEE_PRODUCTIVITY',
  MARKETING_ROI = 'MARKETING_ROI',
  CUSTOMER_SATISFACTION = 'CUSTOMER_SATISFACTION'
}

export class BenchmarkMetric extends DomainPrimitive<BenchmarkMetricEnum> {
  private constructor(value: BenchmarkMetricEnum) { super(value); }
  public static create(value: BenchmarkMetricEnum): BenchmarkMetric {
    if (!Object.values(BenchmarkMetricEnum).includes(value)) throw new Error(`Invalid BenchmarkMetric: ${value}`);
    return new BenchmarkMetric(value);
  }
}

export class BenchmarkScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): BenchmarkScore {
    return new BenchmarkScore(value);
  }
}

export class PercentileRank extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): PercentileRank {
    if (value < 0 || value > 100) throw new Error('PercentileRank must be between 0 and 100.');
    return new PercentileRank(value);
  }
}

export class Deviation extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): Deviation {
    return new Deviation(value); // Can be negative or positive
  }
}
