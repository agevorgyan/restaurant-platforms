import { AggregateRoot, Identifier } from '@saas/domain';
import { ShiftId } from './shift';

export class ScheduleId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduleId { return new ScheduleId(value); }
  public static generate(): ScheduleId { return new ScheduleId(crypto.randomUUID()); }
}

export class Schedule extends AggregateRoot<ScheduleId> {
  constructor(
    id: ScheduleId,
    public startDate: Date,
    public endDate: Date,
    public shiftIds: ShiftId[] = []
  ) {
    super(id);
  }

  public static create(id: ScheduleId, startDate: Date, endDate: Date): Schedule {
    return new Schedule(id, startDate, endDate);
  }

  public addShift(shiftId: ShiftId): void {
    if (!this.shiftIds.some(s => s.equals(shiftId))) {
      this.shiftIds.push(shiftId);
      this.incrementVersion();
    }
  }

  public removeShift(shiftId: ShiftId): void {
    this.shiftIds = this.shiftIds.filter(s => !s.equals(shiftId));
    this.incrementVersion();
  }
}
