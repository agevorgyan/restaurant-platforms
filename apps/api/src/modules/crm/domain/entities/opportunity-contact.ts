import { Entity, Identifier } from '@saas/domain';

export class OpportunityContactId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityContactId { return new OpportunityContactId(value); }
  public static generate(): OpportunityContactId { return new OpportunityContactId(crypto.randomUUID()); }
}

export class OpportunityContact extends Entity<OpportunityContactId> {
  constructor(
    id: OpportunityContactId,
    public readonly role: string,
    public readonly contactId: string,
    public readonly isPrimary: boolean
  ) {
    super(id);
  }

  public static create(role: string, contactId: string, isPrimary: boolean = false): OpportunityContact {
    return new OpportunityContact(OpportunityContactId.generate(), role, contactId, isPrimary);
  }
}
