import { Identifier, DomainPrimitive } from '@saas/domain';

export class InsightId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): InsightId { return new InsightId(value); }
  public static generate(): InsightId { return new InsightId(crypto.randomUUID()); }
}

export enum InsightTypeEnum {
  REVENUE = 'REVENUE',
  SALES = 'SALES',
  CUSTOMER = 'CUSTOMER',
  INVENTORY = 'INVENTORY',
  KITCHEN = 'KITCHEN',
  RESERVATION = 'RESERVATION',
  MARKETING = 'MARKETING',
  EMPLOYEE = 'EMPLOYEE',
  FINANCIAL = 'FINANCIAL',
  OPERATIONAL = 'OPERATIONAL'
}

export class InsightType extends DomainPrimitive<InsightTypeEnum> {
  private constructor(value: InsightTypeEnum) { super(value); }
  public static create(value: InsightTypeEnum): InsightType {
    if (!Object.values(InsightTypeEnum).includes(value)) throw new Error(`Invalid InsightType: ${value}`);
    return new InsightType(value);
  }
}

export enum InsightCategoryEnum {
  ANOMALY = 'ANOMALY',
  TREND = 'TREND',
  RISK = 'RISK',
  OPPORTUNITY = 'OPPORTUNITY',
  CORRELATION = 'CORRELATION'
}

export class InsightCategory extends DomainPrimitive<InsightCategoryEnum> {
  private constructor(value: InsightCategoryEnum) { super(value); }
  public static create(value: InsightCategoryEnum): InsightCategory {
    if (!Object.values(InsightCategoryEnum).includes(value)) throw new Error(`Invalid InsightCategory: ${value}`);
    return new InsightCategory(value);
  }
}

export enum InsightSeverityEnum {
  INFO = 'INFO',
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export class InsightSeverity extends DomainPrimitive<InsightSeverityEnum> {
  private constructor(value: InsightSeverityEnum) { super(value); }
  public static create(value: InsightSeverityEnum): InsightSeverity {
    if (!Object.values(InsightSeverityEnum).includes(value)) throw new Error(`Invalid InsightSeverity: ${value}`);
    return new InsightSeverity(value);
  }
}

export enum InsightPriorityEnum {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  URGENT = 'URGENT'
}

export class InsightPriority extends DomainPrimitive<InsightPriorityEnum> {
  private constructor(value: InsightPriorityEnum) { super(value); }
  public static create(value: InsightPriorityEnum): InsightPriority {
    if (!Object.values(InsightPriorityEnum).includes(value)) throw new Error(`Invalid InsightPriority: ${value}`);
    return new InsightPriority(value);
  }
}

export class ConfidenceScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): ConfidenceScore {
    if (value < 0 || value > 100) throw new Error('ConfidenceScore must be between 0 and 100.');
    return new ConfidenceScore(value);
  }
}

export enum BusinessImpactEnum {
  REVENUE_INCREASE = 'REVENUE_INCREASE',
  COST_REDUCTION = 'COST_REDUCTION',
  RISK_MITIGATION = 'RISK_MITIGATION',
  EFFICIENCY_GAIN = 'EFFICIENCY_GAIN'
}

export class BusinessImpact extends DomainPrimitive<BusinessImpactEnum> {
  private constructor(value: BusinessImpactEnum) { super(value); }
  public static create(value: BusinessImpactEnum): BusinessImpact {
    if (!Object.values(BusinessImpactEnum).includes(value)) throw new Error(`Invalid BusinessImpact: ${value}`);
    return new BusinessImpact(value);
  }
}

export class RecommendationScore extends DomainPrimitive<number> {
  private constructor(value: number) { super(value); }
  public static create(value: number): RecommendationScore {
    if (value < 0 || value > 100) throw new Error('RecommendationScore must be between 0 and 100.');
    return new RecommendationScore(value);
  }
}

export class GeneratedAt extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): GeneratedAt {
    return new GeneratedAt(value);
  }
}
