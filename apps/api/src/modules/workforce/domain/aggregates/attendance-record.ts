import { AggregateRoot, Identifier } from '@saas/domain';
import { AttendanceStatus } from '../value-objects/attendance-status';
import { StaffId } from '../value-objects/staff-id';
import { ShiftId } from './shift';
import { AttendanceRecorded, AttendanceCorrected } from '../events/attendance-events';

export class AttendanceRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttendanceRecordId { return new AttendanceRecordId(value); }
  public static generate(): AttendanceRecordId { return new AttendanceRecordId(crypto.randomUUID()); }
}

export class AttendanceRecord extends AggregateRoot<AttendanceRecordId> {
  constructor(
    id: AttendanceRecordId,
    public staffId: StaffId,
    public shiftId: ShiftId,
    public status: AttendanceStatus,
    public checkInTime: Date,
    public checkOutTime: Date | null = null
  ) {
    super(id);
  }

  public static record(id: AttendanceRecordId, staffId: StaffId, shiftId: ShiftId, status: AttendanceStatus, checkInTime: Date): AttendanceRecord {
    const attendance = new AttendanceRecord(id, staffId, shiftId, status, checkInTime);
    attendance.record(new AttendanceRecorded(id.toValue(), attendance.version(), {
      attendanceId: id.toValue(),
      staffId: staffId.toValue(),
      shiftId: shiftId.toValue(),
      checkInTime
    }));
    return attendance;
  }

  public correct(status: AttendanceStatus, checkInTime?: Date, checkOutTime?: Date): void {
    this.status = status;
    if (checkInTime) this.checkInTime = checkInTime;
    if (checkOutTime !== undefined) this.checkOutTime = checkOutTime;
    this.incrementVersion();
    this.record(new AttendanceCorrected(this.id.toValue(), this.version(), {
      attendanceId: this.id.toValue(),
      reason: 'Manual correction',
      correctedCheckInTime: checkInTime,
      correctedCheckOutTime: checkOutTime
    }));
  }

  public checkOut(time: Date): void {
    if (this.checkOutTime) throw new Error('Already checked out');
    this.checkOutTime = time;
    this.incrementVersion();
  }
}
