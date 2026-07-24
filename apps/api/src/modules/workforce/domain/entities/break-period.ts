import { Entity, Identifier } from '@saas/domain';

export class BreakPeriodId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BreakPeriodId { return new BreakPeriodId(value); }
  public static generate(): BreakPeriodId { return new BreakPeriodId(crypto.randomUUID()); }
}

export class BreakPeriod extends Entity<BreakPeriodId> {
  constructor(
    id: BreakPeriodId,
    public readonly startTime: Date,
    public readonly endTime: Date
  ) {
    super(id);
  }

  public static create(startTime: Date, endTime: Date): BreakPeriod {
    if (startTime >= endTime) {
      throw new Error('Break start time must be before end time.');
    }
    return new BreakPeriod(BreakPeriodId.generate(), startTime, endTime);
  }

  get durationMinutes(): number {
    return (this.endTime.getTime() - this.startTime.getTime()) / (1000 * 60);
  }
}
