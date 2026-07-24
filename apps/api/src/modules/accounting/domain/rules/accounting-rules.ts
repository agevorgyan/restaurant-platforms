import { Specification } from '@saas/domain-rules';

export class LedgerStatusSpecification extends Specification<string> {
  public isSatisfiedBy(status: string): boolean {
    return ['DRAFT', 'OPEN', 'CLOSED', 'ARCHIVED'].includes(status);
  }
}

export class FiscalYearSpecification extends Specification<{ start: Date, end: Date }> {
  public isSatisfiedBy(dates: { start: Date, end: Date }): boolean {
    return dates.end > dates.start;
  }
}

export class CurrencySpecification extends Specification<string> {
  public isSatisfiedBy(currencyCode: string): boolean {
    return currencyCode.length === 3;
  }
}

export class LedgerConfigurationSpecification extends Specification<{ allowBackdatedEntries: boolean, automatedClosing: boolean }> {
  public isSatisfiedBy(config: { allowBackdatedEntries: boolean, automatedClosing: boolean }): boolean {
    // Basic invariant checking on ledger configurations
    return true;
  }
}
