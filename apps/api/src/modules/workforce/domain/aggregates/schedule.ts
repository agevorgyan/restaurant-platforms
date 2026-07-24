import { AggregateRoot, Identifier } from '@saas/domain';
import { ScheduleCode } from '../value-objects/schedule-code';
import { ScheduleName } from '../value-objects/schedule-name';
import { SchedulePeriod } from '../value-objects/schedule-period';
import { ScheduleStatus, ScheduleStatusEnum } from '../value-objects/schedule-status';
import { PlanningWindow } from '../value-objects/planning-window';
import { ScheduleVersion } from '../value-objects/schedule-version';
import { ScheduledShift } from '../entities/scheduled-shift';
import { ShiftId } from './shift';
import { Shift } from './shift';
import { ScheduleCreated, ShiftAddedToSchedule, ShiftRemovedFromSchedule, SchedulePublished, ScheduleLocked, ScheduleUnlocked, ScheduleArchived } from '../events/schedule-events';

export class ScheduleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduleId { return new ScheduleId(value); }
  public static generate(): ScheduleId { return new ScheduleId(crypto.randomUUID()); }
}

export class Schedule extends AggregateRoot<ScheduleId> {
  private _status: ScheduleStatus;
  private _scheduledShifts: ScheduledShift[];
  private _scheduleVersion: ScheduleVersion;

  constructor(
    id: ScheduleId,
    public scheduleCode: ScheduleCode,
    public scheduleName: ScheduleName,
    public schedulePeriod: SchedulePeriod,
    public planningWindow: PlanningWindow,
    scheduledShifts: ScheduledShift[] = [],
    status: ScheduleStatus = ScheduleStatus.create(ScheduleStatusEnum.DRAFT),
    scheduleVersion: ScheduleVersion = ScheduleVersion.create(1)
  ) {
    super(id);
    this._status = status;
    this._scheduledShifts = scheduledShifts;
    this._scheduleVersion = scheduleVersion;
  }

  public static create(
    id: ScheduleId,
    scheduleCode: ScheduleCode,
    scheduleName: ScheduleName,
    schedulePeriod: SchedulePeriod,
    planningWindow: PlanningWindow
  ): Schedule {
    const schedule = new Schedule(id, scheduleCode, scheduleName, schedulePeriod, planningWindow);
    schedule.record(new ScheduleCreated(id.toValue(), schedule.version(), {
      scheduleId: id.toValue(),
      scheduleCode: scheduleCode.toValue(),
      scheduleName: scheduleName.toValue(),
      startDate: schedulePeriod.toValue().startDate,
      endDate: schedulePeriod.toValue().endDate
    }));
    return schedule;
  }

  get status(): ScheduleStatus {
    return this._status;
  }

  get scheduledShifts(): ScheduledShift[] {
    return [...this._scheduledShifts];
  }

  get scheduleVersion(): ScheduleVersion {
    return this._scheduleVersion;
  }

  private incrementScheduleVersion(): void {
    this._scheduleVersion = this._scheduleVersion.increment();
    this.incrementVersion();
  }

  public addShift(shift: Shift): void {
    if (this._status.toValue() === ScheduleStatusEnum.PUBLISHED || this._status.toValue() === ScheduleStatusEnum.LOCKED || this._status.toValue() === ScheduleStatusEnum.ARCHIVED) {
      throw new Error(`Cannot modify a schedule in ${this._status.toValue()} state.`);
    }

    if (this._scheduledShifts.some(s => s.shiftId.equals(shift.id))) {
      throw new Error('Shift is already added to this schedule.');
    }

    // Invariant: Shift time must belong to the schedule period
    if (!this.schedulePeriod.contains(shift.shiftStartTime.toValue()) || !this.schedulePeriod.contains(shift.shiftEndTime.toValue())) {
      throw new Error('Shift time does not belong to the schedule period.');
    }

    this._scheduledShifts.push(ScheduledShift.create(shift.id));
    this.incrementScheduleVersion();

    this.record(new ShiftAddedToSchedule(this.id.toValue(), this.version(), {
      scheduleId: this.id.toValue(),
      shiftId: shift.id.toValue()
    }));
  }

  public removeShift(shiftId: ShiftId): void {
    if (this._status.toValue() === ScheduleStatusEnum.PUBLISHED || this._status.toValue() === ScheduleStatusEnum.LOCKED || this._status.toValue() === ScheduleStatusEnum.ARCHIVED) {
      throw new Error(`Cannot modify a schedule in ${this._status.toValue()} state.`);
    }

    const initialLength = this._scheduledShifts.length;
    this._scheduledShifts = this._scheduledShifts.filter(s => !s.shiftId.equals(shiftId));

    if (this._scheduledShifts.length === initialLength) {
      throw new Error('Shift not found in schedule.');
    }

    this.incrementScheduleVersion();
    this.record(new ShiftRemovedFromSchedule(this.id.toValue(), this.version(), {
      scheduleId: this.id.toValue(),
      shiftId: shiftId.toValue()
    }));
  }

  public publish(): void {
    if (!this._status.canTransitionTo(ScheduleStatusEnum.PUBLISHED)) {
      throw new Error(`Cannot publish schedule from state ${this._status.toValue()}.`);
    }
    this._status = ScheduleStatus.create(ScheduleStatusEnum.PUBLISHED);
    this.incrementScheduleVersion();
    this.record(new SchedulePublished(this.id.toValue(), this.version(), { scheduleId: this.id.toValue() }));
  }

  public lock(): void {
    if (!this._status.canTransitionTo(ScheduleStatusEnum.LOCKED)) {
      throw new Error(`Cannot lock schedule from state ${this._status.toValue()}.`);
    }
    this._status = ScheduleStatus.create(ScheduleStatusEnum.LOCKED);
    this.incrementScheduleVersion();
    this.record(new ScheduleLocked(this.id.toValue(), this.version(), { scheduleId: this.id.toValue() }));
  }

  public unlock(): void {
    if (!this._status.canTransitionTo(ScheduleStatusEnum.PUBLISHED)) {
      throw new Error(`Cannot unlock schedule from state ${this._status.toValue()}.`);
    }
    // Unlocking transitions back to PUBLISHED
    this._status = ScheduleStatus.create(ScheduleStatusEnum.PUBLISHED);
    this.incrementScheduleVersion();
    this.record(new ScheduleUnlocked(this.id.toValue(), this.version(), { scheduleId: this.id.toValue() }));
  }

  public archive(): void {
    if (!this._status.canTransitionTo(ScheduleStatusEnum.ARCHIVED)) {
      throw new Error(`Cannot archive schedule from state ${this._status.toValue()}.`);
    }
    this._status = ScheduleStatus.create(ScheduleStatusEnum.ARCHIVED);
    this.incrementScheduleVersion();
    this.record(new ScheduleArchived(this.id.toValue(), this.version(), { scheduleId: this.id.toValue() }));
  }
}
