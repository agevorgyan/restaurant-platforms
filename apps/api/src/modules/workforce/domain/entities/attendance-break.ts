import { Entity, Identifier } from '@saas/domain';

export class AttendanceBreakId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AttendanceBreakId { return new AttendanceBreakId(value); }
  public static generate(): AttendanceBreakId { return new AttendanceBreakId(crypto.randomUUID()); }
}

export class AttendanceBreak extends Entity<AttendanceBreakId> {
  constructor(
    id: AttendanceBreakId,
    public readonly startTime: Date,
    public readonly endTime: Date | null,
    public readonly expectedDurationMinutes: number
  ) {
    super(id);
  }

  public static create(startTime: Date, expectedDurationMinutes: number): AttendanceBreak {
    return new AttendanceBreak(AttendanceBreakId.generate(), startTime, null, expectedDurationMinutes);
  }

  public endBreak(endTime: Date): AttendanceBreak {
    if (endTime < this.startTime) {
      throw new Error('Break end time cannot be before start time.');
    }
    return new AttendanceBreak(this.id, this.startTime, endTime, this.expectedDurationMinutes);
  }

  public get durationMinutes(): number {
    if (!this.endTime) return 0;
    return Math.floor((this.endTime.getTime() - this.startTime.getTime()) / 60000);
  }
}
