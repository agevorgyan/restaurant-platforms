import { Entity, Identifier } from '@saas/domain';

export class LeadQualificationId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadQualificationId { return new LeadQualificationId(value); }
  public static generate(): LeadQualificationId { return new LeadQualificationId(crypto.randomUUID()); }
}

export class LeadQualification extends Entity<LeadQualificationId> {
  constructor(
    id: LeadQualificationId,
    public readonly isQualified: boolean,
    public readonly qualifiedBy: string,
    public readonly qualifiedAt: Date,
    public readonly criteriaMet: string[],
    public readonly notes: string
  ) {
    super(id);
  }

  public static create(isQualified: boolean, qualifiedBy: string, criteriaMet: string[], notes: string): LeadQualification {
    return new LeadQualification(LeadQualificationId.generate(), isQualified, qualifiedBy, new Date(), criteriaMet, notes);
  }
}
