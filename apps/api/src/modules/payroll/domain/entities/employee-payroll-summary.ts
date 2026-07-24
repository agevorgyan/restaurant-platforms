import { Entity, Identifier } from '@saas/domain';
import { GrossSalary, NetSalary, TaxAmount, DeductionAmount } from '../value-objects/money-types';

export class EmployeePayrollSummaryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): EmployeePayrollSummaryId { return new EmployeePayrollSummaryId(value); }
  public static generate(): EmployeePayrollSummaryId { return new EmployeePayrollSummaryId(crypto.randomUUID()); }
}

export class EmployeePayrollSummary extends Entity<EmployeePayrollSummaryId> {
  constructor(
    id: EmployeePayrollSummaryId,
    public readonly employeeId: string,
    public readonly grossSalary: GrossSalary,
    public readonly netSalary: NetSalary,
    public readonly totalTaxes: TaxAmount,
    public readonly totalDeductions: DeductionAmount
  ) {
    super(id);
  }

  public static create(
    employeeId: string, 
    grossSalary: GrossSalary, 
    netSalary: NetSalary, 
    totalTaxes: TaxAmount, 
    totalDeductions: DeductionAmount
  ): EmployeePayrollSummary {
    return new EmployeePayrollSummary(
      EmployeePayrollSummaryId.generate(), 
      employeeId, 
      grossSalary, 
      netSalary, 
      totalTaxes, 
      totalDeductions
    );
  }
}
