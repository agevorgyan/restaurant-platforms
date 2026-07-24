import { Entity, Identifier } from '@saas/domain';

export class TrainingRecordId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TrainingRecordId { return new TrainingRecordId(value); }
  public static generate(): TrainingRecordId { return new TrainingRecordId(crypto.randomUUID()); }
}

export class TrainingRecord extends Entity<TrainingRecordId> {
  constructor(
    id: TrainingRecordId,
    public readonly trainingCode: string,
    public readonly completionDate: Date,
    public readonly instructorId?: string
  ) {
    super(id);
  }

  public static create(trainingCode: string, completionDate: Date, instructorId?: string): TrainingRecord {
    return new TrainingRecord(TrainingRecordId.generate(), trainingCode, completionDate, instructorId);
  }
}
