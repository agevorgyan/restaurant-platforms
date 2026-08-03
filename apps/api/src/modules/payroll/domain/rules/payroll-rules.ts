import { Specification } from '@saas/domain-rules';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { PayrollRunStatusEnum as PayrollStatusEnum } from '../value-objects/payroll-run-status';

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

export class SingleActivePackageSpecification extends Specification<any[]> {
  public isSatisfiedBy(packages: any[]): boolean {
    return packages.filter(p => p.status.toValue() === 'ACTIVE').length <= 1;
  }
}

export class EffectivePeriodSpecification extends Specification<{ start: Date, end?: Date, newStart: Date, newEnd?: Date }> {
  public isSatisfiedBy(dates: { start: Date, end?: Date, newStart: Date, newEnd?: Date }): boolean {
    if (!dates.end) return dates.newStart > dates.start; // simplified overlap check
    return dates.newStart > dates.end || (dates.newEnd !== undefined && dates.newEnd < dates.start);
  }
}

export class SalaryRateSpecification extends Specification<number> {
  public isSatisfiedBy(rate: number): boolean {
    return rate >= 0;
  }
}

export class AllowanceSpecification extends Specification<{ amount: number }> {
  public isSatisfiedBy(allowance: { amount: number }): boolean {
    return allowance.amount >= 0;
  }
}

export class AdjustmentAmountSpecification extends Specification<number> {
  public isSatisfiedBy(amount: number): boolean {
    return amount !== 0;
  }
}

export class AdjustmentApprovalSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'SUBMITTED';
  }
}

export class ApplicationSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'APPROVED';
  }
}

export class AdjustmentStatusSpecification extends Specification<string> {
  public isSatisfiedBy(status: string): boolean {
    return ['DRAFT', 'SUBMITTED', 'APPROVED', 'APPLIED', 'CANCELLED', 'ARCHIVED'].includes(status);
  }
}

export class TaxProfileEffectivePeriodSpecification extends Specification<{ start: Date, end?: Date, newStart: Date, newEnd?: Date }> {
  public isSatisfiedBy(dates: { start: Date, end?: Date, newStart: Date, newEnd?: Date }): boolean {
    if (!dates.end) return dates.newStart > dates.start;
    return dates.newStart > dates.end || (dates.newEnd !== undefined && dates.newEnd < dates.start);
  }
}

export class TaxRuleSpecification extends Specification<{ brackets: { rate: number }[] }> {
  public isSatisfiedBy(rule: { brackets: { rate: number }[] }): boolean {
    return rule.brackets.every(b => b.rate >= 0 && b.rate <= 1);
  }
}

export class TaxExemptionSpecification extends Specification<{ amount: number, limitAmount: number | null }> {
  public isSatisfiedBy(exemption: { amount: number, limitAmount: number | null }): boolean {
    return exemption.amount >= 0 && (exemption.limitAmount === null || exemption.limitAmount >= exemption.amount);
  }
}

export class TaxJurisdictionSpecification extends Specification<string> {
  public isSatisfiedBy(jurisdiction: string): boolean {
    return jurisdiction.trim().length > 0;
  }
}

export class DocumentCompletenessSpecification extends Specification<{ hasSections: boolean, hasLines: boolean }> {
  public isSatisfiedBy(candidate: { hasSections: boolean, hasLines: boolean }): boolean {
    return candidate.hasSections && candidate.hasLines;
  }
}

export class DocumentApprovalSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'GENERATED';
  }
}

export class DocumentFinalizationSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'APPROVED';
  }
}
