import { AggregateRoot } from '@saas/domain';
import { PayrollRunId } from '../value-objects/payroll-run-id';
import { PayrollRunNumber } from '../value-objects/payroll-run-number';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { PayrollRunStatus, PayrollRunStatusEnum } from '../value-objects/payroll-run-status';
import { PayrollRunType } from '../value-objects/payroll-run-type';
import { Currency } from '../value-objects/currency';
import { EmployeePayrollSummary } from '../entities/employee-payroll-summary';
import { PayrollCalculationIssue } from '../entities/payroll-calculation-issue';
import { PayrollApproval } from '../entities/payroll-approval';
import { PayrollAuditEntry } from '../entities/payroll-audit-entry';
import { 
  PayrollRunCreated, 
  PayrollCalculationStarted, 
  PayrollCalculated, 
  PayrollApproved, 
  PayrollRejected, 
  PayrollFinalized, 
  PayrollReopened, 
  PayrollArchived 
} from '../events/payroll-events';

export class PayrollRun extends AggregateRoot<PayrollRunId> {
  private _status: PayrollRunStatus;
  private _summaries: EmployeePayrollSummary[] = [];
  private _issues: PayrollCalculationIssue[] = [];
  private _approvals: PayrollApproval[] = [];
  private _auditTrail: PayrollAuditEntry[] = [];
  private _totalGross: number = 0;
  private _totalNet: number = 0;

  constructor(
    id: PayrollRunId,
    public readonly runNumber: PayrollRunNumber,
    public readonly period: PayrollPeriod,
    public readonly runType: PayrollRunType,
    public readonly currency: Currency,
    status: PayrollRunStatus = PayrollRunStatus.create(PayrollRunStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(runNumber: PayrollRunNumber, period: PayrollPeriod, runType: PayrollRunType, currency: Currency): PayrollRun {
    const id = PayrollRunId.generate();
    const run = new PayrollRun(id, runNumber, period, runType, currency);
    
    run.record(new PayrollRunCreated(id.toValue(), run.version(), {
      payrollId: id.toValue(),
      periodStartDate: period.toValue().startDate,
      periodEndDate: period.toValue().endDate
    }));
    
    run.addAuditEntry('CREATED', 'SYSTEM', 'Payroll run created');
    return run;
  }

  get status(): PayrollRunStatus { return this._status; }
  get summaries(): EmployeePayrollSummary[] { return [...this._summaries]; }
  get issues(): PayrollCalculationIssue[] { return [...this._issues]; }
  get approvals(): PayrollApproval[] { return [...this._approvals]; }
  get auditTrail(): PayrollAuditEntry[] { return [...this._auditTrail]; }
  get totalGross(): number { return this._totalGross; }
  get totalNet(): number { return this._totalNet; }

  private addAuditEntry(action: string, performedBy: string, details: string): void {
    this._auditTrail.push(PayrollAuditEntry.create(action, performedBy, details));
  }

  public collectWorkforceData(summaries: EmployeePayrollSummary[]): void {
    if (this._status.toValue() === PayrollRunStatusEnum.FINALIZED || this._status.toValue() === PayrollRunStatusEnum.ARCHIVED) {
      throw new Error('Cannot modify a finalized or archived payroll run.');
    }
    if (this._status.toValue() === PayrollRunStatusEnum.APPROVED) {
      throw new Error('Approved payroll cannot be modified. Reopen first.');
    }

    this._summaries = summaries;
    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.DRAFT);
    
    this.addAuditEntry('DATA_COLLECTED', 'SYSTEM', `Collected ${summaries.length} summaries`);
  }

  public calculate(issues: PayrollCalculationIssue[] = []): void {
    if (this._status.toValue() === PayrollRunStatusEnum.FINALIZED || this._status.toValue() === PayrollRunStatusEnum.ARCHIVED) {
      throw new Error('Cannot recalculate a finalized or archived payroll run.');
    }
    if (this._status.toValue() === PayrollRunStatusEnum.APPROVED) {
      throw new Error('Approved payroll cannot be recalculated. Reopen first.');
    }
    if (this._summaries.length === 0) {
      throw new Error('Payroll must contain at least one employee to calculate.');
    }

    this.record(new PayrollCalculationStarted(this.id.toValue(), this.version(), { payrollId: this.id.toValue() }));

    this._issues = issues;
    
    this._totalGross = this._summaries.reduce((sum, s) => sum + s.grossSalary.toValue(), 0);
    this._totalNet = this._summaries.reduce((sum, s) => sum + s.netSalary.toValue(), 0);

    const hasErrors = issues.some(i => i.severity === 'ERROR');
    if (hasErrors) {
      this._status = PayrollRunStatus.create(PayrollRunStatusEnum.DRAFT);
    } else {
      this._status = PayrollRunStatus.create(PayrollRunStatusEnum.CALCULATED);
    }

    this.record(new PayrollCalculated(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      totalGross: this._totalGross,
      totalNet: this._totalNet
    }));
    
    this.addAuditEntry('CALCULATED', 'SYSTEM', `Calculated totals: Gross ${this._totalGross}, Net ${this._totalNet}`);
  }

  public approve(userId: string, remarks?: string): void {
    if (this._status.toValue() !== PayrollRunStatusEnum.CALCULATED) {
      throw new Error('Payroll must be fully CALCULATED without errors before approval.');
    }

    this._approvals.push(PayrollApproval.create(userId, remarks));
    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.APPROVED);

    this.record(new PayrollApproved(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      approvedBy: userId
    }));
    
    this.addAuditEntry('APPROVED', userId, remarks || 'Approved by user');
  }

  public reject(userId: string, reason: string): void {
    if (this._status.toValue() === PayrollRunStatusEnum.FINALIZED || this._status.toValue() === PayrollRunStatusEnum.ARCHIVED) {
      throw new Error('Cannot reject finalized or archived payroll.');
    }

    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.REJECTED);

    this.record(new PayrollRejected(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      rejectedBy: userId,
      reason
    }));
    
    this.addAuditEntry('REJECTED', userId, reason);
  }

  public finalize(userId: string): void {
    if (this._status.toValue() !== PayrollRunStatusEnum.APPROVED) {
      throw new Error('Payroll must be APPROVED before it can be finalized.');
    }

    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.FINALIZED);

    this.record(new PayrollFinalized(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      finalizedBy: userId
    }));
    
    this.addAuditEntry('FINALIZED', userId, 'Finalized payroll run');
  }

  public reopen(userId: string, reason: string): void {
    if (this._status.toValue() === PayrollRunStatusEnum.ARCHIVED) {
      throw new Error('Cannot reopen an archived payroll run.');
    }
    if (this._status.toValue() === PayrollRunStatusEnum.FINALIZED) {
      // Depending on business rules, finalized might not be reopenable, but assuming it can be with high privilege
    }

    // Reopened payroll must invalidate previous approval
    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.DRAFT);
    
    this.record(new PayrollReopened(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      reopenedBy: userId
    }));
    
    this.addAuditEntry('REOPENED', userId, reason);
  }

  public archive(userId: string): void {
    if (this._status.toValue() !== PayrollRunStatusEnum.FINALIZED && this._status.toValue() !== PayrollRunStatusEnum.EXPORTED) {
      throw new Error('Payroll must be finalized or exported before archiving.');
    }

    this._status = PayrollRunStatus.create(PayrollRunStatusEnum.ARCHIVED);

    this.record(new PayrollArchived(this.id.toValue(), this.version(), {
      payrollId: this.id.toValue(),
      archivedBy: userId
    }));
    
    this.addAuditEntry('ARCHIVED', userId, 'Archived payroll run');
  }
}
