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
