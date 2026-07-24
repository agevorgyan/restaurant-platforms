import { Entity, Identifier } from '@saas/domain';

export class ScheduleConflictId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ScheduleConflictId { return new ScheduleConflictId(value); }
  public static generate(): ScheduleConflictId { return new ScheduleConflictId(crypto.randomUUID()); }
}

export class ScheduleConflict extends Entity<ScheduleConflictId> {
  constructor(
    id: ScheduleConflictId,
    public readonly description: string,
    public readonly relatedShiftIds: string[],
    public readonly detectedAt: Date
  ) {
    super(id);
  }

  public static create(description: string, relatedShiftIds: string[]): ScheduleConflict {
    if (!description || description.trim().length === 0) {
      throw new Error('Conflict description cannot be empty.');
    }
    return new ScheduleConflict(ScheduleConflictId.generate(), description, relatedShiftIds, new Date());
  }
}
