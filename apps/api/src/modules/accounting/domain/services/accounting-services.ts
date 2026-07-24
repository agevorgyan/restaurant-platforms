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
