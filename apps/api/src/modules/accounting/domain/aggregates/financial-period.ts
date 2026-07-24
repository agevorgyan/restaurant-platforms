import { AggregateRoot } from '@saas/domain';
import {
  FinancialPeriodId,
  FiscalYear,
  FiscalQuarter,
  FiscalMonth,
  PeriodCode,
  PeriodName,
  PeriodStatus,
  PeriodStatusEnum,
  OpenDate,
  CloseDate,
  LockDate
} from '../value-objects/financial-period-core';
import { PeriodCalendar } from '../entities/period-calendar';
import { ClosingRecord } from '../entities/closing-record';
import { ReopeningRecord } from '../entities/reopening-record';
import { PeriodApprovalRecord } from '../entities/period-approval-record';
import { PeriodHistoryEntry } from '../entities/period-history-entry';
import {
  FinancialPeriodCreated,
  FinancialPeriodOpened,
  FinancialPeriodClosed,
  FinancialPeriodLocked,
  FinancialPeriodReopened,
  FinancialPeriodArchived
} from '../events/financial-period-events';
import {
  OpenPeriodSpecification,
  PeriodOverlapSpecification,
  PostingAllowedSpecification
} from '../rules/accounting-rules';
import { PeriodValidationService, PeriodClosingService } from '../services/accounting-services';

export class FinancialPeriod extends AggregateRoot<FinancialPeriodId> {
  private _status: PeriodStatus;
  
  private _calendar: PeriodCalendar | null = null;
  private _closingRecords: ClosingRecord[] = [];
  private _reopeningRecords: ReopeningRecord[] = [];
  private _approvals: PeriodApprovalRecord[] = [];
  private _history: PeriodHistoryEntry[] = [];
  
  private _openDate: OpenDate | null = null;
  private _closeDate: CloseDate | null = null;
  private _lockDate: LockDate | null = null;

  constructor(
    id: FinancialPeriodId,
    public readonly fiscalYear: FiscalYear,
    public readonly fiscalQuarter: FiscalQuarter,
    public readonly fiscalMonth: FiscalMonth,
    public readonly periodCode: PeriodCode,
    public readonly periodName: PeriodName,
    status: PeriodStatus = PeriodStatus.create(PeriodStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    fiscalYear: FiscalYear,
    fiscalQuarter: FiscalQuarter,
    fiscalMonth: FiscalMonth,
    periodCode: PeriodCode,
    periodName: PeriodName,
    startDate: Date,
    endDate: Date,
    validationService: PeriodValidationService
  ): FinancialPeriod {
    if (!validationService.validatePeriod(startDate, endDate)) {
      throw new Error('Invalid period dates.');
    }

    const id = FinancialPeriodId.generate();
    const period = new FinancialPeriod(
      id,
      fiscalYear,
      fiscalQuarter,
      fiscalMonth,
      periodCode,
      periodName
    );

    period._calendar = PeriodCalendar.create(startDate, endDate);

    period.record(new FinancialPeriodCreated(id.toValue(), period.version(), {
      periodId: id.toValue(),
      periodCode: periodCode.toValue(),
      startDate,
      endDate
    }));

    return period;
  }

  get status(): PeriodStatus { return this._status; }
  get calendar(): PeriodCalendar | null { return this._calendar; }

  public open(openedBy: string): void {
    if (this._status.toValue() !== PeriodStatusEnum.DRAFT) {
      throw new Error('Only DRAFT periods can be opened.');
    }

    this._status = PeriodStatus.create(PeriodStatusEnum.OPEN);
    this._openDate = OpenDate.create(new Date());

    this.record(new FinancialPeriodOpened(this.id.toValue(), this.version(), {
      periodId: this.id.toValue(),
      openedBy
    }));
  }

  public close(closedBy: string, closingJournalId: string, closingService: PeriodClosingService, unpostedJournalsCount: number): void {
    if (this._status.toValue() !== PeriodStatusEnum.OPEN) {
      throw new Error('Only OPEN periods can be closed.');
    }

    if (!closingService.canClose(unpostedJournalsCount)) {
      throw new Error('Cannot close period with unposted journals.');
    }

    this._status = PeriodStatus.create(PeriodStatusEnum.CLOSED);
    this._closeDate = CloseDate.create(new Date());
    
    const record = ClosingRecord.create(closedBy, closingJournalId);
    this._closingRecords.push(record);

    this.record(new FinancialPeriodClosed(this.id.toValue(), this.version(), {
      periodId: this.id.toValue(),
      closedBy
    }));
  }

  public lock(lockedBy: string): void {
    if (this._status.toValue() !== PeriodStatusEnum.CLOSED) {
      throw new Error('Only CLOSED periods can be locked.');
    }

    this._status = PeriodStatus.create(PeriodStatusEnum.LOCKED);
    this._lockDate = LockDate.create(new Date());

    this.record(new FinancialPeriodLocked(this.id.toValue(), this.version(), {
      periodId: this.id.toValue(),
      lockedBy
    }));
  }

  public reopen(reopenedBy: string, reason: string, approverId: string): void {
    if (this._status.toValue() !== PeriodStatusEnum.CLOSED && this._status.toValue() !== PeriodStatusEnum.LOCKED) {
      throw new Error('Only CLOSED or LOCKED periods can be reopened.');
    }

    if (this._status.toValue() === PeriodStatusEnum.LOCKED && !approverId) {
      throw new Error('Locked periods require strict approval to reopen.');
    }

    let approvalId = '';
    if (approverId) {
      const approval = PeriodApprovalRecord.create(approverId, 'REOPEN_LOCKED_PERIOD', reason);
      this._approvals.push(approval);
      approvalId = approval.id.toValue();
    }

    this._status = PeriodStatus.create(PeriodStatusEnum.OPEN);
    
    const record = ReopeningRecord.create(reopenedBy, reason, approvalId);
    this._reopeningRecords.push(record);

    this.record(new FinancialPeriodReopened(this.id.toValue(), this.version(), {
      periodId: this.id.toValue(),
      reopenedBy,
      reason
    }));
  }

  public archive(): void {
    if (this._status.toValue() !== PeriodStatusEnum.LOCKED) {
      throw new Error('Only LOCKED periods can be archived.');
    }

    this._status = PeriodStatus.create(PeriodStatusEnum.ARCHIVED);

    this.record(new FinancialPeriodArchived(this.id.toValue(), this.version(), {
      periodId: this.id.toValue()
    }));
  }
}
