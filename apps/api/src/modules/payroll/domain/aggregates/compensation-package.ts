import { AggregateRoot } from '@saas/domain';
import { 
  CompensationPackageId, 
  CompensationType, 
  CompensationStatus, 
  CompensationStatusEnum, 
  EffectivePeriod 
} from '../value-objects/compensation-package-core';
import { EmployeeReference } from '../value-objects/employee-payroll-core';
import { Currency } from '../value-objects/currency';
import { BaseSalary, HourlyRate } from '../value-objects/money-types';
import { OvertimeRate, NightShiftRate, HolidayRate, WeekendRate } from '../value-objects/compensation-rates';
import { BonusPolicy, DeductionPolicy } from '../value-objects/compensation-policies';
import { SalaryComponent } from '../entities/salary-component';
import { Allowance } from '../entities/allowance';
import { RecurringBonus } from '../entities/recurring-bonus';
import { RecurringDeduction } from '../entities/recurring-deduction';
import { CompensationHistoryEntry } from '../entities/compensation-history-entry';
import {
  CompensationPackageCreated,
  CompensationActivated,
  CompensationDeactivated,
  SalaryChanged,
  AllowanceAdded,
  AllowanceRemoved,
  BonusPolicyChanged,
  HourlyRateChanged,
  CompensationArchived
} from '../events/compensation-events';

export class CompensationPackage extends AggregateRoot<CompensationPackageId> {
  private _status: CompensationStatus;
  private _salaryComponents: SalaryComponent[] = [];
  private _allowances: Allowance[] = [];
  private _recurringBonuses: RecurringBonus[] = [];
  private _recurringDeductions: RecurringDeduction[] = [];
  private _bonusPolicies: BonusPolicy[] = [];
  private _deductionPolicies: DeductionPolicy[] = [];
  private _history: CompensationHistoryEntry[] = [];

  constructor(
    id: CompensationPackageId,
    public readonly employeeReference: EmployeeReference,
    public readonly compensationType: CompensationType,
    public readonly currency: Currency,
    public readonly effectivePeriod: EffectivePeriod,
    private _baseSalary: BaseSalary,
    private _hourlyRate: HourlyRate,
    private _overtimeRate: OvertimeRate,
    private _nightShiftRate: NightShiftRate,
    private _holidayRate: HolidayRate,
    private _weekendRate: WeekendRate,
    status: CompensationStatus = CompensationStatus.create(CompensationStatusEnum.DRAFT)
  ) {
    super(id);
    this._status = status;
  }

  public static create(
    employeeReference: EmployeeReference,
    compensationType: CompensationType,
    currency: Currency,
    effectivePeriod: EffectivePeriod,
    baseSalary: BaseSalary,
    hourlyRate: HourlyRate,
    overtimeRate: OvertimeRate,
    nightShiftRate: NightShiftRate,
    holidayRate: HolidayRate,
    weekendRate: WeekendRate
  ): CompensationPackage {
    const id = CompensationPackageId.generate();
    const pkg = new CompensationPackage(
      id, employeeReference, compensationType, currency, effectivePeriod,
      baseSalary, hourlyRate, overtimeRate, nightShiftRate, holidayRate, weekendRate
    );
    
    pkg.record(new CompensationPackageCreated(id.toValue(), pkg.version(), {
      packageId: id.toValue(),
      employeeReference: employeeReference.toValue()
    }));

    pkg.addHistoryEntry('CREATED', 'SYSTEM', 'INITIAL', 'DRAFT');
    return pkg;
  }

  get status(): CompensationStatus { return this._status; }
  get baseSalary(): BaseSalary { return this._baseSalary; }
  get hourlyRate(): HourlyRate { return this._hourlyRate; }
  get overtimeRate(): OvertimeRate { return this._overtimeRate; }
  get nightShiftRate(): NightShiftRate { return this._nightShiftRate; }
  get holidayRate(): HolidayRate { return this._holidayRate; }
  get weekendRate(): WeekendRate { return this._weekendRate; }
  
  get salaryComponents(): SalaryComponent[] { return [...this._salaryComponents]; }
  get allowances(): Allowance[] { return [...this._allowances]; }
  get recurringBonuses(): RecurringBonus[] { return [...this._recurringBonuses]; }
  get recurringDeductions(): RecurringDeduction[] { return [...this._recurringDeductions]; }
  get bonusPolicies(): BonusPolicy[] { return [...this._bonusPolicies]; }
  get deductionPolicies(): DeductionPolicy[] { return [...this._deductionPolicies]; }
  get history(): CompensationHistoryEntry[] { return [...this._history]; }

  private addHistoryEntry(action: string, performedBy: string, previousState: string, newState: string): void {
    this._history.push(CompensationHistoryEntry.create(action, performedBy, previousState, newState));
  }

  private ensureNotArchived(): void {
    if (this._status.toValue() === CompensationStatusEnum.ARCHIVED) {
      throw new Error('Archived compensation package cannot be modified.');
    }
  }

  public activate(userId: string): void {
    this.ensureNotArchived();
    if (this._status.toValue() === CompensationStatusEnum.ACTIVE) return;

    const oldStatus = this._status.toValue();
    this._status = CompensationStatus.create(CompensationStatusEnum.ACTIVE);

    this.record(new CompensationActivated(this.id.toValue(), this.version(), {
      packageId: this.id.toValue()
    }));
    
    this.addHistoryEntry('ACTIVATED', userId, oldStatus, 'ACTIVE');
  }

  public deactivate(userId: string): void {
    this.ensureNotArchived();
    if (this._status.toValue() === CompensationStatusEnum.DEACTIVATED) return;

    const oldStatus = this._status.toValue();
    this._status = CompensationStatus.create(CompensationStatusEnum.DEACTIVATED);

    this.record(new CompensationDeactivated(this.id.toValue(), this.version(), {
      packageId: this.id.toValue()
    }));
    
    this.addHistoryEntry('DEACTIVATED', userId, oldStatus, 'DEACTIVATED');
  }

  public archive(userId: string): void {
    if (this._status.toValue() === CompensationStatusEnum.ARCHIVED) return;

    const oldStatus = this._status.toValue();
    this._status = CompensationStatus.create(CompensationStatusEnum.ARCHIVED);

    this.record(new CompensationArchived(this.id.toValue(), this.version(), {
      packageId: this.id.toValue()
    }));
    
    this.addHistoryEntry('ARCHIVED', userId, oldStatus, 'ARCHIVED');
  }

  public changeSalary(newAmount: BaseSalary, userId: string): void {
    this.ensureNotArchived();
    const oldAmount = this._baseSalary.toValue();
    this._baseSalary = newAmount;

    this.record(new SalaryChanged(this.id.toValue(), this.version(), {
      packageId: this.id.toValue(),
      oldAmount,
      newAmount: newAmount.toValue()
    }));

    this.addHistoryEntry('SALARY_CHANGED', userId, oldAmount.toString(), newAmount.toValue().toString());
  }

  public updateHourlyRate(newRate: HourlyRate, userId: string): void {
    this.ensureNotArchived();
    const oldRate = this._hourlyRate.toValue();
    this._hourlyRate = newRate;

    this.record(new HourlyRateChanged(this.id.toValue(), this.version(), {
      packageId: this.id.toValue(),
      newRate: newRate.toValue()
    }));

    this.addHistoryEntry('HOURLY_RATE_CHANGED', userId, oldRate.toString(), newRate.toValue().toString());
  }

  public addAllowance(allowance: Allowance, userId: string): void {
    this.ensureNotArchived();
    this._allowances.push(allowance);

    this.record(new AllowanceAdded(this.id.toValue(), this.version(), {
      packageId: this.id.toValue(),
      allowanceId: allowance.id.toValue()
    }));

    this.addHistoryEntry('ALLOWANCE_ADDED', userId, 'N/A', allowance.id.toValue());
  }

  public removeAllowance(allowanceId: string, userId: string): void {
    this.ensureNotArchived();
    const index = this._allowances.findIndex(a => a.id.toValue() === allowanceId);
    if (index === -1) throw new Error('Allowance not found.');
    
    this._allowances.splice(index, 1);

    this.record(new AllowanceRemoved(this.id.toValue(), this.version(), {
      packageId: this.id.toValue(),
      allowanceId
    }));

    this.addHistoryEntry('ALLOWANCE_REMOVED', userId, allowanceId, 'REMOVED');
  }

  public addBonusPolicy(policy: BonusPolicy, userId: string): void {
    this.ensureNotArchived();
    this._bonusPolicies.push(policy);

    this.record(new BonusPolicyChanged(this.id.toValue(), this.version(), {
      packageId: this.id.toValue(),
      policyType: policy.toValue().type
    }));

    this.addHistoryEntry('BONUS_POLICY_ADDED', userId, 'N/A', policy.toValue().type);
  }

  public updateOvertimeRate(newRate: OvertimeRate, userId: string): void {
    this.ensureNotArchived();
    const oldRate = this._overtimeRate.toValue();
    this._overtimeRate = newRate;
    
    this.addHistoryEntry('OVERTIME_RATE_CHANGED', userId, oldRate.toString(), newRate.toValue().toString());
  }
}
