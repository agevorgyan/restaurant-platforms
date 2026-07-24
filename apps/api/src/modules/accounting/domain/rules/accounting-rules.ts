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

export class UniqueAccountCodeSpecification extends Specification<{ codes: string[], candidate: string }> {
  public isSatisfiedBy(context: { codes: string[], candidate: string }): boolean {
    return !context.codes.includes(context.candidate);
  }
}

export class HierarchyIntegritySpecification extends Specification<{ edges: { parent: string | null, child: string }[], candidateParent: string, candidateChild: string }> {
  public isSatisfiedBy(context: { edges: { parent: string | null, child: string }[], candidateParent: string, candidateChild: string }): boolean {
    let current: string | null = context.candidateParent;
    const visited = new Set<string>();
    while (current) {
      if (current === context.candidateChild) return false;
      if (visited.has(current)) return false;
      visited.add(current);
      const edge = context.edges.find(e => e.child === current);
      if (!edge || !edge.parent) break;
      current = edge.parent;
    }
    return true;
  }
}

export class PostingAccountSpecification extends Specification<{ isActive: boolean }> {
  public isSatisfiedBy(candidate: { isActive: boolean }): boolean {
    return candidate.isActive;
  }
}

export class AccountActivationSpecification extends Specification<{ isChartActive: boolean }> {
  public isSatisfiedBy(candidate: { isChartActive: boolean }): boolean {
    return candidate.isChartActive;
  }
}
