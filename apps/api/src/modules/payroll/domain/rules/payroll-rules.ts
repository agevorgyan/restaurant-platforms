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

