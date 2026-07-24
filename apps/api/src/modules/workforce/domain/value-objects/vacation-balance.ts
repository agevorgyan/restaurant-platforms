import { DomainPrimitive } from '@saas/domain';

export class VacationBalance extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): VacationBalance {
    if (value < 0) {
      throw new Error('Vacation balance cannot be negative.');
    }
    return new VacationBalance(value);
  }

  public deduct(days: number): VacationBalance {
    if (this.value - days < 0) {
      throw new Error('Insufficient vacation balance.');
    }
    return new VacationBalance(this.value - days);
  }

  public add(days: number): VacationBalance {
    return new VacationBalance(this.value + days);
  }
}
