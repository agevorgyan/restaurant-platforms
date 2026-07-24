import { Specification } from '@saas/domain-rules';

export class FinancialPeriodSpecification extends Specification<{ periodStatus: string }> {
  public isSatisfiedBy(context: { periodStatus: string }): boolean {
    return context.periodStatus === 'OPEN' || context.periodStatus === 'CLOSED' || context.periodStatus === 'LOCKED' || context.periodStatus === 'ARCHIVED';
  }
}

export class ReportPermissionSpecification extends Specification<{ userRoles: string[], requiredRole: string }> {
  public isSatisfiedBy(context: { userRoles: string[], requiredRole: string }): boolean {
    return context.userRoles.includes(context.requiredRole) || context.userRoles.includes('ADMIN');
  }
}

export class CurrencySpecification extends Specification<{ baseCurrency: string, reportCurrency: string, exchangeRateValid: boolean }> {
  public isSatisfiedBy(context: { baseCurrency: string, reportCurrency: string, exchangeRateValid: boolean }): boolean {
    if (context.baseCurrency === context.reportCurrency) {
      return true;
    }
    return context.exchangeRateValid;
  }
}
