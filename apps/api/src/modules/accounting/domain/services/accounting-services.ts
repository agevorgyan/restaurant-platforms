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

export class PaymentAllocationService implements IDomainService {
  public canAllocate(outstandingAmount: number, allocationAmount: number): boolean {
    return outstandingAmount >= allocationAmount && allocationAmount > 0;
  }
}

export class ReceivableBalanceService implements IDomainService {
  public calculateOutstanding(originalAmount: number, allocations: number[], writeOffs: number[]): number {
    const totalAllocated = allocations.reduce((sum, a) => sum + a, 0);
    const totalWrittenOff = writeOffs.reduce((sum, w) => sum + w, 0);
    return originalAmount - totalAllocated - totalWrittenOff;
  }
}

export class CollectionEvaluationService implements IDomainService {
  public requiresCollection(status: string, dueDate: Date, currentDate: Date): boolean {
    return (status === 'ISSUED' || status === 'PARTIALLY_PAID') && currentDate > dueDate;
  }
}
