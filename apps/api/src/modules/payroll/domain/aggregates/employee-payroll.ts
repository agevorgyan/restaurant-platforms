import { AggregateRoot } from '@saas/domain';
import { EmployeePayrollId, EmployeeReference, EmployeePayrollStatus, EmployeePayrollStatusEnum } from '../value-objects/employee-payroll-core';
import { PayrollPeriod } from '../value-objects/payroll-period';
import { RegularHours, OvertimeHours, NightHours, HolidayHours } from '../value-objects/work-hours';
import { BaseSalary, GrossSalary, TaxAmount, DeductionAmount, BonusAmount, NetSalary, HourlyRate } from '../value-objects/money-types';
import { Currency } from '../value-objects/currency';
import { WorkedHoursEntry } from '../entities/worked-hours-entry';
import { PayrollBonus } from '../entities/payroll-bonus';
import { PayrollDeduction } from '../entities/payroll-deduction';
import { PayrollTax } from '../entities/payroll-tax';
import { PayrollAdjustment } from '../entities/payroll-adjustment';
import { PayrollAuditEntry } from '../entities/payroll-audit-entry';
import {
  EmployeePayrollCreated,
  AttendanceImported,
  GrossSalaryCalculated,
  BonusApplied,
  DeductionApplied,
  TaxesCalculated,
  NetSalaryCalculated,
  EmployeePayrollApproved,
  EmployeePayrollRejected,
  EmployeePayrollFinalized
} from '../events/employee-payroll-events';

export class EmployeePayroll extends AggregateRoot<EmployeePayrollId> {
  private _status: EmployeePayrollStatus;
  private _workedHours: WorkedHoursEntry[] = [];
  private _bonuses: PayrollBonus[] = [];
  private _deductions: PayrollDeduction[] = [];
  private _taxes: PayrollTax[] = [];
  private _adjustments: PayrollAdjustment[] = [];
  private _auditTrail: PayrollAuditEntry[] = [];

  private _grossAmount: GrossSalary = GrossSalary.create(0);
  private _netAmount: NetSalary = NetSalary.create(0);
  private _totalTax: TaxAmount = TaxAmount.create(0);
  private _totalDeductions: DeductionAmount = DeductionAmount.create(0);
  private _totalBonuses: BonusAmount = BonusAmount.create(0);

  constructor(
    id: EmployeePayrollId,
    public readonly employeeReference: EmployeeReference,
    public readonly payrollPeriod: PayrollPeriod,
    public readonly baseSalary: BaseSalary,
    public readonly hourlyRate: HourlyRate,
    public readonly currency: Currency,
    status: EmployeePayrollStatus = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    employeeReference: EmployeeReference,
    payrollPeriod: PayrollPeriod,
    baseSalary: BaseSalary,
    hourlyRate: HourlyRate,
    currency: Currency
  ): EmployeePayroll {
    const id = EmployeePayrollId.generate();
    const payroll = new EmployeePayroll(id, employeeReference, payrollPeriod, baseSalary, hourlyRate, currency);
    
    payroll.record(new EmployeePayrollCreated(id.toValue(), payroll.version(), {
      employeePayrollId: id.toValue(),
      employeeReference: employeeReference.toValue(),
      periodId: payrollPeriod.toValue().startDate.toISOString() // Simplifying ID for period
    }));

    payroll.addAuditEntry('CREATED', 'SYSTEM', 'Employee payroll initialized');
    return payroll;
  }

  get status(): EmployeePayrollStatus { return this._status; }
  get workedHours(): WorkedHoursEntry[] { return [...this._workedHours]; }
  get bonuses(): PayrollBonus[] { return [...this._bonuses]; }
  get deductions(): PayrollDeduction[] { return [...this._deductions]; }
  get taxes(): PayrollTax[] { return [...this._taxes]; }
  get adjustments(): PayrollAdjustment[] { return [...this._adjustments]; }
  get auditTrail(): PayrollAuditEntry[] { return [...this._auditTrail]; }
  get grossAmount(): GrossSalary { return this._grossAmount; }
  get netAmount(): NetSalary { return this._netAmount; }
  get totalTax(): TaxAmount { return this._totalTax; }
  get totalDeductions(): DeductionAmount { return this._totalDeductions; }
  get totalBonuses(): BonusAmount { return this._totalBonuses; }

  private addAuditEntry(action: string, performedBy: string, details: string): void {
    this._auditTrail.push(PayrollAuditEntry.create(action, performedBy, details));
  }

  private ensureNotFinalized(): void {
    if (this._status.toValue() === EmployeePayrollStatusEnum.FINALIZED) {
      throw new Error('Finalized payroll cannot be modified.');
    }
  }

  public importAttendanceSummary(entries: WorkedHoursEntry[]): void {
    this.ensureNotFinalized();
    this._workedHours = entries;
    const totalHours = entries.reduce((sum, entry) => sum + entry.regularHours + entry.overtimeHours + entry.nightHours + entry.holidayHours, 0);

    this.record(new AttendanceImported(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      totalHours
    }));
    
    this.addAuditEntry('ATTENDANCE_IMPORTED', 'SYSTEM', `Imported ${entries.length} attendance entries`);
    this._status = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.DRAFT);
  }

  public calculateGrossSalary(): void {
    this.ensureNotFinalized();
    
    let calculatedGross = this.baseSalary.toValue();
    const hourlyVal = this.hourlyRate.toValue();

    if (calculatedGross === 0) {
      const totalRegular = this._workedHours.reduce((sum, h) => sum + h.regularHours, 0);
      calculatedGross = totalRegular * hourlyVal;
    }

    const totalOvertime = this._workedHours.reduce((sum, h) => sum + h.overtimeHours, 0);
    calculatedGross += totalOvertime * hourlyVal * 1.5; // standard OT multiplier logic

    if (calculatedGross < 0) {
      throw new Error('Gross amount cannot be negative.');
    }

    this._grossAmount = GrossSalary.create(calculatedGross);

    this.record(new GrossSalaryCalculated(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      grossAmount: calculatedGross
    }));
    
    this.addAuditEntry('GROSS_CALCULATED', 'SYSTEM', `Calculated gross: ${calculatedGross}`);
  }

  public applyBonus(bonus: PayrollBonus): void {
    this.ensureNotFinalized();
    this._bonuses.push(bonus);
    
    const sum = this._bonuses.reduce((acc, b) => acc + b.amount, 0);
    this._totalBonuses = BonusAmount.create(sum);

    this.record(new BonusApplied(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      bonusId: bonus.id.toValue(),
      amount: bonus.amount
    }));
    
    this.addAuditEntry('BONUS_APPLIED', 'SYSTEM', `Bonus applied: ${bonus.amount}`);
  }

  public applyDeduction(deduction: PayrollDeduction): void {
    this.ensureNotFinalized();
    this._deductions.push(deduction);
    
    const sum = this._deductions.reduce((acc, d) => acc + d.amount, 0);
    this._totalDeductions = DeductionAmount.create(sum);

    this.record(new DeductionApplied(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      deductionId: deduction.id.toValue(),
      amount: deduction.amount
    }));
    
    this.addAuditEntry('DEDUCTION_APPLIED', 'SYSTEM', `Deduction applied: ${deduction.amount}`);
  }

  public calculateTaxes(taxes: PayrollTax[]): void {
    this.ensureNotFinalized();
    this._taxes = taxes;
    
    const sum = this._taxes.reduce((acc, t) => acc + t.amount, 0);
    this._totalTax = TaxAmount.create(sum);

    this.record(new TaxesCalculated(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      taxAmount: sum
    }));
    
    this.addAuditEntry('TAXES_CALCULATED', 'SYSTEM', `Calculated taxes: ${sum}`);
  }

  public calculateNetSalary(): void {
    this.ensureNotFinalized();
    
    const net = this._grossAmount.toValue() + this._totalBonuses.toValue() - this._totalDeductions.toValue() - this._totalTax.toValue();

    if (net > this._grossAmount.toValue() + this._totalBonuses.toValue() - this._totalDeductions.toValue()) {
       throw new Error('Net amount cannot exceed gross amount after deductions.');
    }

    if (net < 0) {
      throw new Error('Net amount cannot be negative.'); // Defensive
    }

    this._netAmount = NetSalary.create(net);
    this._status = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.CALCULATED);

    this.record(new NetSalaryCalculated(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      netAmount: net
    }));
    
    this.addAuditEntry('NET_CALCULATED', 'SYSTEM', `Calculated net: ${net}`);
  }

  public approve(userId: string): void {
    if (this._status.toValue() !== EmployeePayrollStatusEnum.CALCULATED) {
      throw new Error('Only fully CALCULATED payrolls can be approved.');
    }

    this._status = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.APPROVED);

    this.record(new EmployeePayrollApproved(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      approvedBy: userId
    }));
    
    this.addAuditEntry('APPROVED', userId, 'Employee payroll approved');
  }

  public reject(userId: string, reason: string): void {
    this.ensureNotFinalized();

    // Rejected payroll must be recalculated before approval
    this._status = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.REJECTED);

    this.record(new EmployeePayrollRejected(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      rejectedBy: userId,
      reason
    }));
    
    this.addAuditEntry('REJECTED', userId, reason);
  }

  public finalize(userId: string): void {
    if (this._status.toValue() !== EmployeePayrollStatusEnum.APPROVED) {
      throw new Error('Payroll must be APPROVED before finalization.');
    }

    this._status = EmployeePayrollStatus.create(EmployeePayrollStatusEnum.FINALIZED);

    this.record(new EmployeePayrollFinalized(this.id.toValue(), this.version(), {
      employeePayrollId: this.id.toValue(),
      finalizedBy: userId
    }));
    
    this.addAuditEntry('FINALIZED', userId, 'Employee payroll finalized');
  }
}
