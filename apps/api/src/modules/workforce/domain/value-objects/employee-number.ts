import { DomainPrimitive } from '@saas/domain';

export class EmployeeNumber extends DomainPrimitive<string> {
  private constructor(value: string) {
    super(value);
  }

  public static create(value: string): EmployeeNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Employee number cannot be empty.');
    }
    return new EmployeeNumber(value);
  }
}
