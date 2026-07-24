import { DomainPrimitive } from '@saas/domain';

export enum PayrollStatusEnum {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  FINALIZED = 'FINALIZED',
  EXPORTED = 'EXPORTED'
}

export class PayrollStatus extends DomainPrimitive<PayrollStatusEnum> {
  private constructor(value: PayrollStatusEnum) { super(value); }
  
  public static create(value: PayrollStatusEnum): PayrollStatus {
    if (!Object.values(PayrollStatusEnum).includes(value)) {
      throw new Error(`Invalid payroll status: ${value}`);
    }
    return new PayrollStatus(value);
  }
}
