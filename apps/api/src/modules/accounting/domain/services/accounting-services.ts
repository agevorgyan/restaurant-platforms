import { IDomainService } from '@saas/domain';

export class DoubleEntryService implements IDomainService {
  public validateDoubleEntry(debits: number, credits: number): boolean {
    return Math.abs(debits - credits) < 0.0001;
  }
}

export class DoubleEntryValidationService extends DoubleEntryService {
  public validateLines(lines: any[]): boolean {
    return lines.length >= 2;
  }
}

export class JournalBalancingService implements IDomainService {
  public calculateTotals(debits: any[], credits: any[]): { debits: number; credits: number; totalDebit: number; totalCredit: number } {
    const totalDebit = debits.reduce((acc, val) => acc + (typeof val === 'number' ? val : val?.toValue?.() || 0), 0);
    const totalCredit = credits.reduce((acc, val) => acc + (typeof val === 'number' ? val : val?.toValue?.() || 0), 0);
    return { debits: totalDebit, credits: totalCredit, totalDebit, totalCredit };
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

export class PayableBalanceService implements IDomainService {
  public calculateOutstanding(originalAmount: number, allocations: number[], creditNotes: number[], writeOffs: number[]): number {
    const totalAllocated = allocations.reduce((sum, a) => sum + a, 0);
    const totalCreditNotes = creditNotes.reduce((sum, c) => sum + c, 0);
    const totalWrittenOff = writeOffs.reduce((sum, w) => sum + w, 0);
    return originalAmount - totalAllocated - totalCreditNotes - totalWrittenOff;
  }
}

export class CreditNoteService implements IDomainService {
  public canApply(outstandingAmount: number, creditNoteAmount: number): boolean {
    return outstandingAmount >= creditNoteAmount && creditNoteAmount > 0;
  }
}

export class PaymentScheduleService implements IDomainService {
  public validateSchedule(originalAmount: number, scheduledAmounts: number[]): boolean {
    const totalScheduled = scheduledAmounts.reduce((sum, a) => sum + a, 0);
    return totalScheduled <= originalAmount;
  }
}

export class PeriodValidationService implements IDomainService {
  public validatePeriod(startDate: Date, endDate: Date): boolean {
    return startDate < endDate;
  }
}

export class PeriodClosingService implements IDomainService {
  public canClose(unpostedJournalsCount: number): boolean {
    return unpostedJournalsCount === 0;
  }
}

export class FiscalCalendarService implements IDomainService {
  public validateCalendar(year: number, periodsCount: number): boolean {
    return year > 1900 && periodsCount > 0 && periodsCount <= 13; // Usually 12, sometimes 13th for adjustments
  }
}

export class PostingPeriodService implements IDomainService {
  public isDateInPeriod(date: Date, periodStart: Date, periodEnd: Date): boolean {
    return date >= periodStart && date <= periodEnd;
  }
}
