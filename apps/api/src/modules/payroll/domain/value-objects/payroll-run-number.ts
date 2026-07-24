import { DomainPrimitive } from '@saas/domain';

export class PayrollRunNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollRunNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Payroll number cannot be empty.');
    }
    return new PayrollRunNumber(value.trim());
  }
}
