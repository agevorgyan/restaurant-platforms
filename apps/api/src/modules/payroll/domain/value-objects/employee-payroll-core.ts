import { Identifier, DomainPrimitive } from '@saas/domain';

export class EmployeePayrollId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmployeePayrollId { return new EmployeePayrollId(value); }
  public static generate(): EmployeePayrollId { return new EmployeePayrollId(crypto.randomUUID()); }
}

export class EmployeeReference extends DomainPrimitive<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmployeeReference {
    if (!value || value.trim().length === 0) {
      throw new Error('Employee reference cannot be empty.');
    }
    return new EmployeeReference(value.trim());
  }
}

export enum EmployeePayrollStatusEnum {
  DRAFT = 'DRAFT',
  CALCULATED = 'CALCULATED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FINALIZED = 'FINALIZED'
}

export class EmployeePayrollStatus extends DomainPrimitive<EmployeePayrollStatusEnum> {
  private constructor(value: EmployeePayrollStatusEnum) { super(value); }
  
  public static create(value: EmployeePayrollStatusEnum): EmployeePayrollStatus {
    if (!Object.values(EmployeePayrollStatusEnum).includes(value)) {
      throw new Error(`Invalid employee payroll status: ${value}`);
    }
    return new EmployeePayrollStatus(value);
  }
}
