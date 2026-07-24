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
    return true;
  }
}

export class BalancedJournalSpecification extends Specification<{ totalDebit: number, totalCredit: number }> {
  public isSatisfiedBy(candidate: { totalDebit: number, totalCredit: number }): boolean {
    // Handling floating point equality
    return Math.abs(candidate.totalDebit - candidate.totalCredit) < 0.0001;
  }
}

export class PostingPeriodSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'OPEN';
  }
}

export class ExchangeRateSpecification extends Specification<{ currency: string, baseCurrency: string, exchangeRate: number | null }> {
  public isSatisfiedBy(candidate: { currency: string, baseCurrency: string, exchangeRate: number | null }): boolean {
    if (candidate.currency === candidate.baseCurrency) return true;
    return candidate.exchangeRate !== null && candidate.exchangeRate > 0;
  }
}

export class JournalApprovalSpecification extends Specification<{ status: string }> {
  public isSatisfiedBy(candidate: { status: string }): boolean {
    return candidate.status === 'PENDING_APPROVAL';
  }
}
