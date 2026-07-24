import { Entity, Identifier } from '@saas/domain';

export class LeadContactId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadContactId { return new LeadContactId(value); }
  public static generate(): LeadContactId { return new LeadContactId(crypto.randomUUID()); }
}

export class LeadContact extends Entity<LeadContactId> {
  constructor(
    id: LeadContactId,
    public readonly method: string,
    public readonly contactDate: Date,
    public readonly representativeId: string,
    public readonly notes: string,
    public readonly outcome: string
  ) {
    super(id);
  }

  public static create(method: string, representativeId: string, notes: string, outcome: string): LeadContact {
    return new LeadContact(LeadContactId.generate(), method, new Date(), representativeId, notes, outcome);
  }
}
