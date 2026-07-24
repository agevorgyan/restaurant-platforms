import { AggregateRoot, Identifier } from '@saas/domain';
import { StaffId } from '../value-objects/staff-id';
import { ShiftId } from './shift';
import { AttendanceStatus, AttendanceStatusEnum } from '../value-objects/attendance-status';
import { CheckInTime } from '../value-objects/check-in-time';
import { CheckOutTime } from '../value-objects/check-out-time';
import { AttendanceSource, AttendanceSourceEnum } from '../value-objects/attendance-source';
import { AttendanceBreak } from '../entities/attendance-break';
import { AttendanceCorrection } from '../entities/attendance-correction';
import { AttendanceAuditEntry } from '../entities/attendance-audit-entry';
import { AttendanceCreated, EmployeeCheckedIn, BreakStarted, BreakEnded, EmployeeCheckedOut, AttendanceCorrected, AttendanceCorrectionApproved, AttendanceCorrectionRejected } from '../events/attendance-events';

export class AttendanceRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttendanceRecordId { return new AttendanceRecordId(value); }
  public static generate(): AttendanceRecordId { return new AttendanceRecordId(crypto.randomUUID()); }
}

export class AttendanceRecord extends AggregateRoot<AttendanceRecordId> {
  private _status: AttendanceStatus;
  private _checkInTime: CheckInTime | null = null;
  private _checkOutTime: CheckOutTime | null = null;
  private _breaks: AttendanceBreak[] = [];
  private _corrections: AttendanceCorrection[] = [];
  private _auditTrail: AttendanceAuditEntry[] = [];

  constructor(
    id: AttendanceRecordId,
    public readonly staffId: StaffId,
    public readonly shiftId: ShiftId,
    status: AttendanceStatus = AttendanceStatus.create(AttendanceStatusEnum.ACTIVE)
  ) {
    super(id);
    this._status = status;
  }

  public static create(staffId: StaffId, shiftId: ShiftId): AttendanceRecord {
    const id = AttendanceRecordId.generate();
    const record = new AttendanceRecord(id, staffId, shiftId);
    
    record.record(new AttendanceCreated(id.toValue(), record.version(), {
      attendanceId: id.toValue(),
      staffId: staffId.toValue(),
      shiftId: shiftId.toValue()
    }));

    return record;
  }

  get status(): AttendanceStatus {
    return this._status;
  }

  get checkInTime(): CheckInTime | null {
    return this._checkInTime;
  }

  get checkOutTime(): CheckOutTime | null {
    return this._checkOutTime;
  }

  get breaks(): AttendanceBreak[] {
    return [...this._breaks];
  }

  get corrections(): AttendanceCorrection[] {
    return [...this._corrections];
  }

  get auditTrail(): AttendanceAuditEntry[] {
    return [...this._auditTrail];
  }

  private addAudit(action: string, details: string): void {
    this._auditTrail.push(AttendanceAuditEntry.create(action, details));
  }

  public checkIn(time: Date, source: AttendanceSourceEnum): void {
    if (this._checkInTime) {
      throw new Error('Already checked in.');
    }
    this._checkInTime = CheckInTime.create(time);
    this.addAudit('CHECK_IN', `Checked in via ${source} at ${time.toISOString()}`);
    
    this.record(new EmployeeCheckedIn(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      checkInTime: time,
      source
    }));
  }

  public startBreak(time: Date): void {
    if (!this._checkInTime) {
      throw new Error('Must check in before starting a break.');
    }
    if (this._checkOutTime) {
      throw new Error('Cannot start break after check out.');
    }
    const openBreak = this._breaks.find(b => b.endTime === null);
    if (openBreak) {
      throw new Error('Already on break.');
    }

    const newBreak = AttendanceBreak.create(time, 30); // Defaulting expected to 30 mins for example
    this._breaks.push(newBreak);
    this.addAudit('BREAK_START', `Break started at ${time.toISOString()}`);

    this.record(new BreakStarted(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      breakId: newBreak.id.toValue(),
      startTime: time
    }));
  }

  public endBreak(time: Date): void {
    const openBreakIndex = this._breaks.findIndex(b => b.endTime === null);
    if (openBreakIndex === -1) {
      throw new Error('No active break to end.');
    }

    const openBreak = this._breaks[openBreakIndex];
    this._breaks[openBreakIndex] = openBreak.endBreak(time);
    this.addAudit('BREAK_END', `Break ended at ${time.toISOString()}`);

    this.record(new BreakEnded(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      breakId: openBreak.id.toValue(),
      endTime: time
    }));
  }

  public checkOut(time: Date, source: AttendanceSourceEnum): void {
    if (!this._checkInTime) {
      throw new Error('Must check in before checking out.');
    }
    if (this._checkOutTime) {
      throw new Error('Already checked out.');
    }
    if (time < this._checkInTime.toValue()) {
      throw new Error('Check-out time cannot be before check-in time.');
    }
    const openBreak = this._breaks.find(b => b.endTime === null);
    if (openBreak) {
      throw new Error('Must end break before checking out.');
    }

    this._checkOutTime = CheckOutTime.create(time);
    this._status = AttendanceStatus.create(AttendanceStatusEnum.COMPLETED);
    this.addAudit('CHECK_OUT', `Checked out via ${source} at ${time.toISOString()}`);

    this.record(new EmployeeCheckedOut(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      checkOutTime: time,
      source
    }));
  }

  public requestCorrection(proposedCheckIn: Date, proposedCheckOut: Date, reason: string): void {
    if (this._status.toValue() === AttendanceStatusEnum.LOCKED) {
      throw new Error('Cannot request correction on locked attendance.');
    }

    const correction = AttendanceCorrection.create(proposedCheckIn, proposedCheckOut, reason);
    this._corrections.push(correction);
    this._status = AttendanceStatus.create(AttendanceStatusEnum.CORRECTION_PENDING);
    this.addAudit('CORRECTION_REQUESTED', `Correction requested for reason: ${reason}`);

    this.record(new AttendanceCorrected(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      correctionId: correction.id.toValue(),
      reason
    }));
  }

  public approveCorrection(correctionId: string): void {
    const idx = this._corrections.findIndex(c => c.id.toValue() === correctionId);
    if (idx === -1) {
      throw new Error('Correction not found.');
    }

    this._corrections[idx] = this._corrections[idx].approve();
    this._checkInTime = CheckInTime.create(this._corrections[idx].proposedCheckIn);
    this._checkOutTime = CheckOutTime.create(this._corrections[idx].proposedCheckOut);
    this._status = AttendanceStatus.create(AttendanceStatusEnum.COMPLETED);
    this.addAudit('CORRECTION_APPROVED', `Correction ${correctionId} approved.`);

    this.record(new AttendanceCorrectionApproved(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      correctionId
    }));
  }

  public rejectCorrection(correctionId: string): void {
    const idx = this._corrections.findIndex(c => c.id.toValue() === correctionId);
    if (idx === -1) {
      throw new Error('Correction not found.');
    }

    this._corrections[idx] = this._corrections[idx].reject();
    this._status = AttendanceStatus.create(AttendanceStatusEnum.COMPLETED);
    this.addAudit('CORRECTION_REJECTED', `Correction ${correctionId} rejected.`);

    this.record(new AttendanceCorrectionRejected(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      correctionId
    }));
  }

  public lockForPayroll(): void {
    this._status = AttendanceStatus.create(AttendanceStatusEnum.LOCKED);
    this.addAudit('PAYROLL_LOCK', 'Locked for payroll.');
  }
}
