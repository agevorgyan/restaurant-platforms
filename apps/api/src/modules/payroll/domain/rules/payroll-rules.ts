import { Specification } from '@saas/domain-rules';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { PayrollStatusEnum } from '../value-objects/payroll-status';

export interface PayrollPeriodContext {
  newPeriod: PayrollPeriod;
  existingFinalizedPeriods: PayrollPeriod[];
}

export class PayrollPeriodSpecification extends Specification<PayrollPeriodContext> {
  public isSatisfiedBy(candidate: PayrollPeriodContext): boolean {
    return !candidate.existingFinalizedPeriods.some(p => p.overlaps(candidate.newPeriod));
  }
}

export interface PayrollApprovalContext {
  status: PayrollStatusEnum;
  totalGross: number;
  totalNet: number;
}

export class PayrollApprovalSpecification extends Specification<PayrollApprovalContext> {
  public isSatisfiedBy(candidate: PayrollApprovalContext): boolean {
    return candidate.status === PayrollStatusEnum.CALCULATED && candidate.totalGross > 0 && candidate.totalNet >= 0;
  }
}

export class SalaryCalculationSpecification extends Specification<number> {
  public isSatisfiedBy(candidate: number): boolean {
    // Gross must be strictly positive
    return candidate > 0;
  }
}

export class TaxProfileSpecification extends Specification<{ hasActiveProfile: boolean, isTaxExempt: boolean }> {
  public isSatisfiedBy(candidate: { hasActiveProfile: boolean, isTaxExempt: boolean }): boolean {
    return candidate.hasActiveProfile || candidate.isTaxExempt;
  }
}

export class PayrollCompletenessSpecification extends Specification<number> {
  public isSatisfiedBy(employeeCount: number): boolean {
    return employeeCount > 0;
  }
}

export class ApprovalRequiredSpecification extends Specification<PayrollStatusEnum> {
  public isSatisfiedBy(status: PayrollStatusEnum): boolean {
    return status === PayrollStatusEnum.CALCULATED;
  }
}

export class FinalizationSpecification extends Specification<PayrollStatusEnum> {
  public isSatisfiedBy(status: PayrollStatusEnum): boolean {
    return status === PayrollStatusEnum.APPROVED;
  }
}
export class GrossSalarySpecification extends Specification<number> {
  public isSatisfiedBy(grossAmount: number): boolean {
    return grossAmount >= 0;
  }
}

export class TaxCalculationSpecification extends Specification<{ grossAmount: number, taxAmount: number }> {
  public isSatisfiedBy(candidate: { grossAmount: number, taxAmount: number }): boolean {
    return candidate.taxAmount >= 0 && candidate.taxAmount <= candidate.grossAmount;
  }
}

export class EmployeeApprovalSpecification extends Specification<{ status: string, netAmount: number, grossAmount: number }> {
  public isSatisfiedBy(candidate: { status: string, netAmount: number, grossAmount: number }): boolean {
    return candidate.status === 'CALCULATED' && candidate.netAmount >= 0 && candidate.grossAmount >= 0;
  }
}
