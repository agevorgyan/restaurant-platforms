import { AggregateRoot, Identifier } from '@saas/domain';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { PreparationStatus, PreparationStatusEnum } from '../value-objects/preparation-status';
import { PayrollAttendanceSummary } from '../entities/payroll-attendance-summary';
import { PayrollShiftSummary } from '../entities/payroll-shift-summary';
import { PayrollValidationIssue } from '../entities/payroll-validation-issue';
import { PayrollExportRecord } from '../entities/payroll-export-record';
import { PayrollPreparationCreated, PayrollDataCollected, PayrollPreparationValidated, PayrollPreparationFinalized, PayrollPreparationReopened, PayrollPreparationExported } from '../events/payroll-preparation-events';

export class PayrollPreparationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollPreparationId { return new PayrollPreparationId(value); }
  public static generate(): PayrollPreparationId { return new PayrollPreparationId(crypto.randomUUID()); }
}

export class PayrollPreparation extends AggregateRoot<PayrollPreparationId> {
  private _status: PreparationStatus;
  private _attendanceSummaries: PayrollAttendanceSummary[] = [];
  private _shiftSummaries: PayrollShiftSummary[] = [];
  private _validationIssues: PayrollValidationIssue[] = [];
  private _exportRecords: PayrollExportRecord[] = [];

  constructor(
    id: PayrollPreparationId,
    public readonly period: PayrollPeriod,
    status: PreparationStatus = PreparationStatus.create(PreparationStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(period: PayrollPeriod): PayrollPreparation {
    const id = PayrollPreparationId.generate();
    const preparation = new PayrollPreparation(id, period);

    preparation.record(new PayrollPreparationCreated(id.toValue(), preparation.version(), {
      preparationId: id.toValue(),
      startDate: period.toValue().startDate,
      endDate: period.toValue().endDate
    }));

    return preparation;
  }

  get status(): PreparationStatus { return this._status; }
  get attendanceSummaries(): PayrollAttendanceSummary[] { return [...this._attendanceSummaries]; }
  get shiftSummaries(): PayrollShiftSummary[] { return [...this._shiftSummaries]; }
  get validationIssues(): PayrollValidationIssue[] { return [...this._validationIssues]; }

  public collectData(attendanceSummaries: PayrollAttendanceSummary[], shiftSummaries: PayrollShiftSummary[]): void {
    if (this._status.toValue() === PreparationStatusEnum.FINALIZED || this._status.toValue() === PreparationStatusEnum.EXPORTED) {
      throw new Error('Cannot modify a finalized or exported preparation.');
    }

    this._attendanceSummaries = attendanceSummaries;
    this._shiftSummaries = shiftSummaries;

    this.record(new PayrollDataCollected(this.id.toValue(), this.version(), {
      preparationId: this.id.toValue(),
      summaryCount: attendanceSummaries.length
    }));
  }

  public validate(issues: PayrollValidationIssue[]): void {
    if (this._status.toValue() === PreparationStatusEnum.FINALIZED || this._status.toValue() === PreparationStatusEnum.EXPORTED) {
      throw new Error('Cannot validate a finalized or exported preparation.');
    }

    this._validationIssues = issues;
    const isCompliant = issues.filter(i => i.severity === 'ERROR').length === 0;

    if (isCompliant) {
      this._status = PreparationStatus.create(PreparationStatusEnum.VALIDATED);
    } else {
      this._status = PreparationStatus.create(PreparationStatusEnum.DRAFT);
    }

    this.record(new PayrollPreparationValidated(this.id.toValue(), this.version(), {
      preparationId: this.id.toValue(),
      isCompliant
    }));
  }

  public finalize(userId: string): void {
    if (this._status.toValue() !== PreparationStatusEnum.VALIDATED) {
      throw new Error('Preparation must be VALIDATED before it can be finalized.');
    }
    if (this._attendanceSummaries.length === 0) {
      throw new Error('Preparation must contain at least one employee summary to be finalized.');
    }

    this._status = PreparationStatus.create(PreparationStatusEnum.FINALIZED);

    this.record(new PayrollPreparationFinalized(this.id.toValue(), this.version(), {
      preparationId: this.id.toValue(),
      finalizedAt: new Date(),
      finalizedBy: userId
    }));
  }

  public reopen(userId: string, reason: string): void {
    if (this._status.toValue() === PreparationStatusEnum.EXPORTED) {
      throw new Error('Cannot reopen an exported preparation.');
    }

    this._status = PreparationStatus.create(PreparationStatusEnum.DRAFT);

    this.record(new PayrollPreparationReopened(this.id.toValue(), this.version(), {
      preparationId: this.id.toValue(),
      reopenedAt: new Date(),
      reopenedBy: userId,
      reason
    }));
  }

  public export(format: string, destinationSystem: string, userId: string): void {
    if (this._status.toValue() !== PreparationStatusEnum.FINALIZED && this._status.toValue() !== PreparationStatusEnum.EXPORTED) {
      throw new Error('Preparation must be FINALIZED before it can be exported.');
    }

    const record = PayrollExportRecord.create(format, destinationSystem, userId);
    this._exportRecords.push(record);
    this._status = PreparationStatus.create(PreparationStatusEnum.EXPORTED);

    this.record(new PayrollPreparationExported(this.id.toValue(), this.version(), {
      preparationId: this.id.toValue(),
      exportFormat: format,
      destinationSystem,
      exportedAt: new Date()
    }));
  }
}
