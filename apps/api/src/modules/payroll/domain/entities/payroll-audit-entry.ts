import { Entity, Identifier } from '@saas/domain';

export class PayrollAuditEntryId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollAuditEntryId { return new PayrollAuditEntryId(value); }
  public static generate(): PayrollAuditEntryId { return new PayrollAuditEntryId(crypto.randomUUID()); }
}

export class PayrollAuditEntry extends Entity<PayrollAuditEntryId> {
  constructor(
    id: PayrollAuditEntryId,
    public readonly action: string,
    public readonly performedBy: string,
    public readonly timestamp: Date,
    public readonly details: string
  ) {
    super(id);
  }

  public static create(action: string, performedBy: string, details: string): PayrollAuditEntry {
    return new PayrollAuditEntry(
      PayrollAuditEntryId.generate(), 
      action, 
      performedBy, 
      new Date(), 
      details
    );
  }
}
