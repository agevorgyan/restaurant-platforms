import { Entity, Identifier } from '@saas/domain';

export class WorkedHoursEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): WorkedHoursEntryId { return new WorkedHoursEntryId(value); }
  public static generate(): WorkedHoursEntryId { return new WorkedHoursEntryId(crypto.randomUUID()); }
}

export class WorkedHoursEntry extends Entity<WorkedHoursEntryId> {
  constructor(
    id: WorkedHoursEntryId,
    public readonly date: Date,
    public readonly regularHours: number,
    public readonly overtimeHours: number,
    public readonly nightHours: number,
    public readonly holidayHours: number
  ) {
    super(id);
  }

  public static create(date: Date, regularHours: number, overtimeHours: number, nightHours: number, holidayHours: number): WorkedHoursEntry {
    return new WorkedHoursEntry(
      WorkedHoursEntryId.generate(), 
      date, 
      regularHours, 
      overtimeHours, 
      nightHours, 
      holidayHours
    );
  }
}
