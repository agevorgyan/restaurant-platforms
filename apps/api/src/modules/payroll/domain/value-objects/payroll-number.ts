import { DomainPrimitive } from '@saas/domain';

export class PayrollNumber extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollNumber {
    if (!value || value.trim().length === 0) {
      throw new Error('Payroll number cannot be empty.');
    }
    return new PayrollNumber(value.trim());
  }
}
