import { DomainPrimitive } from '@saas/domain';

export enum PayrollRunStatusEnum {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FINALIZED = 'FINALIZED',
  EXPORTED = 'EXPORTED',
  ARCHIVED = 'ARCHIVED'
}

export class PayrollRunStatus extends DomainPrimitive<PayrollRunStatusEnum> {
  private constructor(value: PayrollRunStatusEnum) { super(value); }
  
  public static create(value: PayrollRunStatusEnum): PayrollRunStatus {
    if (!Object.values(PayrollRunStatusEnum).includes(value)) {
      throw new Error(`Invalid payroll run status: ${value}`);
    }
    return new PayrollRunStatus(value);
  }
}
