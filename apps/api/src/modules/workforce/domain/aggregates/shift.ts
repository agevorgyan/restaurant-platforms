import { AggregateRoot, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { ShiftCode } from '../value-objects/shift-code';
import { ShiftName } from '../value-objects/shift-name';
import { ShiftStatus, ShiftStatusEnum } from '../value-objects/shift-status';
import { ShiftType } from '../value-objects/shift-type';
import { ShiftStartTime } from '../value-objects/shift-start-time';
import { ShiftEndTime } from '../value-objects/shift-end-time';
import { BreakDuration } from '../value-objects/break-duration';
import { MaximumCapacity } from '../value-objects/maximum-capacity';
import { AssignedEmployees } from '../value-objects/assigned-employees';
import { AssignedEmployee } from '../entities/assigned-employee';
import { ShiftCreated, EmployeeAssignedToShift, EmployeeRemovedFromShift, ShiftStarted, ShiftEnded, ShiftCompleted, ShiftCancelled } from '../events/shift-events';

export class ShiftId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ShiftId { return new ShiftId(value); }
  public static generate(): ShiftId { return new ShiftId(crypto.randomUUID()); }
}

export class Shift extends AggregateRoot<ShiftId> {
  private _status: ShiftStatus;
  private _assignedEmployees: AssignedEmployees;

  constructor(
    id: ShiftId,
    public shiftCode: ShiftCode,
    public shiftName: ShiftName,
    public shiftType: ShiftType,
    public shiftStartTime: ShiftStartTime,
    public shiftEndTime: ShiftEndTime,
    public breakDuration: BreakDuration,
    public maximumCapacity: MaximumCapacity,
    assignedEmployees: AssignedEmployees = AssignedEmployees.create(),
    status: ShiftStatus = ShiftStatus.create(ShiftStatusEnum.SCHEDULED)
  ) {
    super(id);
    this._status = status;
    this._assignedEmployees = assignedEmployees;
    this.validateInvariants();
  }

  public static create(
    id: ShiftId,
    shiftCode: ShiftCode,
    shiftName: ShiftName,
    shiftType: ShiftType,
    shiftStartTime: ShiftStartTime,
    shiftEndTime: ShiftEndTime,
    breakDuration: BreakDuration,
    maximumCapacity: MaximumCapacity
  ): Shift {
    const shift = new Shift(id, shiftCode, shiftName, shiftType, shiftStartTime, shiftEndTime, breakDuration, maximumCapacity);
    shift.record(new ShiftCreated(id.toValue(), shift.version(), {
      shiftId: id.toValue(),
      shiftCode: shiftCode.toValue(),
      shiftName: shiftName.toValue(),
      startTime: shiftStartTime.toValue(),
      endTime: shiftEndTime.toValue(),
      maximumCapacity: maximumCapacity.toValue()
    }));
    return shift;
  }

  private validateInvariants(): void {
    if (this.shiftStartTime.toValue().getTime() >= this.shiftEndTime.toValue().getTime()) {
      throw new Error('Shift start time must be before end time.');
    }
    const durationMs = this.shiftEndTime.toValue().getTime() - this.shiftStartTime.toValue().getTime();
    const durationMinutes = durationMs / (1000 * 60);
    if (this.breakDuration.toValue() > durationMinutes) {
      throw new Error('Break duration cannot exceed working duration.');
    }
  }

  get status(): ShiftStatus {
    return this._status;
  }

  get assignedEmployees(): AssignedEmployees {
    return this._assignedEmployees;
  }

  public assignEmployee(staffId: StaffId): void {
    if (this._status.toValue() === ShiftStatusEnum.COMPLETED || this._status.toValue() === ShiftStatusEnum.CANCELLED) {
      throw new Error('Cannot modify assignments for a completed or cancelled shift.');
    }
    
    // Capacity checked by domain service prior, but we do basic invariant here
    if (this._assignedEmployees.count >= this.maximumCapacity.toValue()) {
      throw new Error('Shift maximum capacity exceeded.');
    }

    const assignment = AssignedEmployee.create(staffId);
    this._assignedEmployees = this._assignedEmployees.add(assignment);
    
    this.incrementVersion();
    this.record(new EmployeeAssignedToShift(this.id.toValue(), this.version(), {
      shiftId: this.id.toValue(),
      staffId: staffId.toValue()
    }));
  }

  public removeEmployee(staffId: StaffId): void {
    if (this._status.toValue() === ShiftStatusEnum.COMPLETED || this._status.toValue() === ShiftStatusEnum.CANCELLED) {
      throw new Error('Cannot modify assignments for a completed or cancelled shift.');
    }
    if (!this._assignedEmployees.has(staffId)) {
      throw new Error('Employee is not assigned to this shift.');
    }

    this._assignedEmployees = this._assignedEmployees.remove(staffId);
    
    this.incrementVersion();
    this.record(new EmployeeRemovedFromShift(this.id.toValue(), this.version(), {
      shiftId: this.id.toValue(),
      staffId: staffId.toValue()
    }));
  }

  public startShift(): void {
    if (!this._status.canTransitionTo(ShiftStatusEnum.IN_PROGRESS)) {
      throw new Error(`Cannot transition shift from ${this._status.toValue()} to IN_PROGRESS.`);
    }
    this._status = ShiftStatus.create(ShiftStatusEnum.IN_PROGRESS);
    this.incrementVersion();
    this.record(new ShiftStarted(this.id.toValue(), this.version(), { shiftId: this.id.toValue() }));
  }

  public completeShift(): void {
    if (!this._status.canTransitionTo(ShiftStatusEnum.COMPLETED)) {
      throw new Error(`Cannot transition shift from ${this._status.toValue()} to COMPLETED.`);
    }
    this._status = ShiftStatus.create(ShiftStatusEnum.COMPLETED);
    this.incrementVersion();
    this.record(new ShiftCompleted(this.id.toValue(), this.version(), { shiftId: this.id.toValue() }));
  }

  public cancelShift(reason?: string): void {
    if (!this._status.canTransitionTo(ShiftStatusEnum.CANCELLED)) {
      throw new Error(`Cannot transition shift from ${this._status.toValue()} to CANCELLED.`);
    }
    this._status = ShiftStatus.create(ShiftStatusEnum.CANCELLED);
    this.incrementVersion();
    this.record(new ShiftCancelled(this.id.toValue(), this.version(), { shiftId: this.id.toValue(), reason }));
  }
}
