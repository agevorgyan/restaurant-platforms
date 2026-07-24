import { Entity, Identifier } from '@saas/domain';

export class PeriodCalendarId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PeriodCalendarId { return new PeriodCalendarId(value); }
  public static generate(): PeriodCalendarId { return new PeriodCalendarId(crypto.randomUUID()); }
}

export class PeriodCalendar extends Entity<PeriodCalendarId> {
  constructor(
    id: PeriodCalendarId,
    public readonly startDate: Date,
    public readonly endDate: Date,
    public readonly totalDays: number
  ) {
    super(id);
    if (startDate >= endDate) throw new Error('Start date must be before end date.');
  }

  public static create(startDate: Date, endDate: Date): PeriodCalendar {
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
    return new PeriodCalendar(PeriodCalendarId.generate(), startDate, endDate, totalDays);
  }
}
