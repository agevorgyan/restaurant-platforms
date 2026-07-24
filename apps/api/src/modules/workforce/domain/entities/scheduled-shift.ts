import { Entity, Identifier } from '@saas/domain';
import { ShiftId } from '../aggregates/shift';

export class ScheduledShiftId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduledShiftId { return new ScheduledShiftId(value); }
  public static generate(): ScheduledShiftId { return new ScheduledShiftId(crypto.randomUUID()); }
}

export class ScheduledShift extends Entity<ScheduledShiftId> {
  constructor(
    id: ScheduledShiftId,
    public readonly shiftId: ShiftId,
    public readonly addedAt: Date
  ) {
    super(id);
  }

  public static create(shiftId: ShiftId): ScheduledShift {
    return new ScheduledShift(ScheduledShiftId.generate(), shiftId, new Date());
  }
}
