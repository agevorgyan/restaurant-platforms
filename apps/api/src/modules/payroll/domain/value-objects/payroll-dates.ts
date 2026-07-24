import { DomainPrimitive } from '@saas/domain';

export class CalculationDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): CalculationDate {
    return new CalculationDate(value);
  }
}

export class ApprovalDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): ApprovalDate {
    return new ApprovalDate(value);
  }
}

export class FinalizationDate extends DomainPrimitive<Date> {
  private constructor(value: Date) { super(value); }
  public static create(value: Date): FinalizationDate {
    return new FinalizationDate(value);
  }
}
