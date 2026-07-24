import { Entity, Identifier } from '@saas/domain';

export class LeadTagId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): LeadTagId { return new LeadTagId(value); }
  public static generate(): LeadTagId { return new LeadTagId(crypto.randomUUID()); }
}

export class LeadTag extends Entity<LeadTagId> {
  constructor(
    id: LeadTagId,
    public readonly name: string,
    public readonly addedBy: string,
    public readonly addedAt: Date
  ) {
    super(id);
  }

  public static create(name: string, addedBy: string): LeadTag {
    if (!name || name.trim().length === 0) throw new Error('Tag name cannot be empty.');
    return new LeadTag(LeadTagId.generate(), name.toLowerCase().trim(), addedBy, new Date());
  }
}
