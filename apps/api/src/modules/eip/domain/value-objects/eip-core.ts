import { Identifier, DomainPrimitive } from '@saas/domain';

export class KpiId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KpiId { return new KpiId(value); }
  public static generate(): KpiId { return new KpiId(crypto.randomUUID()); }
}

export class KpiCode extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KpiCode {
    if (!value || value.trim().length === 0) throw new Error('KPI code cannot be empty.');
    return new KpiCode(value);
  }
}

export class KpiName extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): KpiName {
    if (!value || value.trim().length === 0) throw new Error('KPI name cannot be empty.');
    return new KpiName(value);
  }
}

export enum KpiCategoryEnum {
  FINANCIAL = 'FINANCIAL',
  SALES = 'SALES',
  CRM = 'CRM',
  MARKETING = 'MARKETING',
  INVENTORY = 'INVENTORY',
  KITCHEN = 'KITCHEN',
  OPERATIONS = 'OPERATIONS',
  WORKFORCE = 'WORKFORCE',
  RESERVATION = 'RESERVATION'
}

export class KpiCategory extends DomainPrimitive<KpiCategoryEnum> {
  private constructor(value: KpiCategoryEnum) { super(value); }
  public static create(value: KpiCategoryEnum): KpiCategory {
    if (!Object.values(KpiCategoryEnum).includes(value)) throw new Error(`Invalid KPI category: ${value}`);
    return new KpiCategory(value);
  }
}

export class KpiValue extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): KpiValue {
    return new KpiValue(value);
  }
}

export enum CalculationPeriodEnum {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  REALTIME = 'REALTIME'
}

export class CalculationPeriod extends DomainPrimitive<CalculationPeriodEnum> {
  private constructor(value: CalculationPeriodEnum) { super(value); }
  public static create(value: CalculationPeriodEnum): CalculationPeriod {
    if (!Object.values(CalculationPeriodEnum).includes(value)) throw new Error(`Invalid calculation period: ${value}`);
    return new CalculationPeriod(value);
  }
}

export enum KpiUnitEnum {
  CURRENCY = 'CURRENCY',
  PERCENTAGE = 'PERCENTAGE',
  COUNT = 'COUNT',
  DURATION = 'DURATION',
  RATIO = 'RATIO'
}

export class KpiUnit extends DomainPrimitive<KpiUnitEnum> {
  private constructor(value: KpiUnitEnum) { super(value); }
  public static create(value: KpiUnitEnum): KpiUnit {
    if (!Object.values(KpiUnitEnum).includes(value)) throw new Error(`Invalid KPI unit: ${value}`);
    return new KpiUnit(value);
  }
}

export enum TrendDirectionEnum {
  UP = 'UP',
  DOWN = 'DOWN',
  FLAT = 'FLAT'
}

export class TrendDirection extends DomainPrimitive<TrendDirectionEnum> {
  private constructor(value: TrendDirectionEnum) { super(value); }
  public static create(value: TrendDirectionEnum): TrendDirection {
    if (!Object.values(TrendDirectionEnum).includes(value)) throw new Error(`Invalid trend direction: ${value}`);
    return new TrendDirection(value);
  }
}
