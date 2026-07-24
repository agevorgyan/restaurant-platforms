import { IDomainService } from '@saas/domain';

export class PayrollCalculationService implements IDomainService {
  public calculateNetSalary(gross: number, totalDeductions: number, totalTaxes: number, totalBonuses: number): number {
    return gross + totalBonuses - totalDeductions - totalTaxes;
  }
}

export class TaxCalculationService implements IDomainService {
  public calculateTax(gross: number, taxRate: number): number {
    return gross * (taxRate / 100);
  }
}

export class CompensationService implements IDomainService {
  public calculateProratedSalary(monthlySalary: number, daysWorked: number, totalDaysInMonth: number): number {
    return (monthlySalary / totalDaysInMonth) * daysWorked;
  }
}

export class PayrollValidationService implements IDomainService {
  public validate(gross: number, net: number, deductions: number, taxes: number): boolean {
    return gross >= (deductions + taxes) && net >= 0;
  }
}

export class PayrollExportService implements IDomainService {
  public formatForExport(payrollData: any, format: string): any {
    return {
      exportedAt: new Date(),
      format,
      data: payrollData
    };
  }
}

export class PayrollApprovalService implements IDomainService {
  public validateApprovalConstraints(totalEmployees: number, totalGross: number, issuesCount: number): boolean {
    return totalEmployees > 0 && totalGross > 0 && issuesCount === 0;
  }
}

export class PayrollConsistencyService implements IDomainService {
  public checkConsistency(summariesGross: number[], totalExpectedGross: number): boolean {
    const calculatedGross = summariesGross.reduce((sum, current) => sum + current, 0);
    return Math.abs(calculatedGross - totalExpectedGross) < 0.01; // handling floating point
  }
}

export class SalaryCalculationService implements IDomainService {
  public calculateBaseSalary(baseSalary: number, regularHours: number, hourlyRate: number): number {
    return baseSalary > 0 ? baseSalary : regularHours * hourlyRate;
  }
}

export class BonusCalculationService implements IDomainService {
  public calculateTotalBonus(bonuses: { amount: number }[]): number {
    return bonuses.reduce((sum, b) => sum + b.amount, 0);
  }
}

export class DeductionCalculationService implements IDomainService {
  public calculateTotalDeduction(deductions: { amount: number }[]): number {
    return deductions.reduce((sum, d) => sum + d.amount, 0);
  }
}
