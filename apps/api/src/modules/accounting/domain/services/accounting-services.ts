import { IDomainService } from '@saas/domain';

export class LedgerBalanceService implements IDomainService {
  public calculateCurrentBalance(openingBalance: number, credits: number, debits: number): number {
    return openingBalance + credits - debits;
  }
}

export class LedgerValidationService implements IDomainService {
  public validateLedgerClosure(unpostedEntriesCount: number): boolean {
    return unpostedEntriesCount === 0;
  }
}

export class LedgerClosingService implements IDomainService {
  public validateClosure(currentStatus: string): boolean {
    return currentStatus === 'OPEN';
  }
}

export class DoubleEntryValidationService implements IDomainService {
  public validateLines(lines: any[]): boolean {
    return lines.length >= 2;
  }
}

export class JournalBalancingService implements IDomainService {
  public calculateTotals(debits: number[], credits: number[]): { totalDebit: number, totalCredit: number } {
    const totalDebit = debits.reduce((sum, val) => sum + val, 0);
    const totalCredit = credits.reduce((sum, val) => sum + val, 0);
    return { totalDebit, totalCredit };
  }
}

export class PostingService implements IDomainService {
  public canPost(status: string, periodStatus: string): boolean {
    return status === 'APPROVED' && periodStatus === 'OPEN';
  }
}

export class ExchangeRateService implements IDomainService {
  public validateRate(rate: number): boolean {
    return rate > 0;
  }
}

export class AccountValidationService implements IDomainService {
  public validate(code: string, name: string): boolean {
    return code.trim().length > 0 && name.trim().length > 0;
  }
}

export class AccountHierarchyService implements IDomainService {
  public canMove(accountId: string, newParentId: string | null, edges: { parent: string | null, child: string }[]): boolean {
    if (accountId === newParentId) return false;
    return true;
  }
}

export class AccountMappingService implements IDomainService {
  public validateMapping(accountId: string, externalCode: string): boolean {
    return externalCode.length > 0;
  }
}
