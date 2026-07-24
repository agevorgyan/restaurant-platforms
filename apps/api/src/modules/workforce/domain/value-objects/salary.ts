import { DomainPrimitive } from '@saas/domain';

export class Salary extends DomainPrimitive<number> {
  private constructor(value: number) {
    super(value);
  }

  public static create(value: number): Salary {
    if (value < 0) {
      throw new Error('Salary cannot be negative.');
    }
    return new Salary(value);
  }
}
