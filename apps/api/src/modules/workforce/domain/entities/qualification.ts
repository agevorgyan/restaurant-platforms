import { Entity, Identifier } from '@saas/domain';

export class QualificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): QualificationId { return new QualificationId(value); }
  public static generate(): QualificationId { return new QualificationId(crypto.randomUUID()); }
}

export class Qualification extends Entity<QualificationId> {
  constructor(
    id: QualificationId,
    public readonly qualificationCode: string,
    public readonly awardedDate: Date
  ) {
    super(id);
  }

  public static create(qualificationCode: string, awardedDate: Date): Qualification {
    return new Qualification(QualificationId.generate(), qualificationCode, awardedDate);
  }
}
