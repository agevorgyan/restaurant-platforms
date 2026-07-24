import { DomainPrimitive } from '@saas/domain';

export enum PayrollRunTypeEnum {
  REGULAR = 'REGULAR',
  OFF_CYCLE = 'OFF_CYCLE',
  BONUS = 'BONUS',
  TERMINATION = 'TERMINATION'
}

export class PayrollRunType extends DomainPrimitive<PayrollRunTypeEnum> {
  private constructor(value: PayrollRunTypeEnum) { super(value); }
  
  public static create(value: PayrollRunTypeEnum): PayrollRunType {
    if (!Object.values(PayrollRunTypeEnum).includes(value)) {
      throw new Error(`Invalid payroll run type: ${value}`);
    }
    return new PayrollRunType(value);
  }
}
