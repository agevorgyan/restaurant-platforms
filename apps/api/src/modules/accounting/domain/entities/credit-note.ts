import { Entity, Identifier } from '@saas/domain';

export class CreditNoteId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): CreditNoteId { return new CreditNoteId(value); }
  public static generate(): CreditNoteId { return new CreditNoteId(crypto.randomUUID()); }
}

export class CreditNote extends Entity<CreditNoteId> {
  constructor(
    id: CreditNoteId,
    public readonly creditNoteReference: string,
    public readonly amount: number,
    public readonly applyDate: Date,
    public readonly reason: string
  ) {
    super(id);
    if (amount <= 0) throw new Error('Credit note amount must be strictly positive.');
  }

  public static create(creditNoteReference: string, amount: number, reason: string): CreditNote {
    return new CreditNote(CreditNoteId.generate(), creditNoteReference, amount, new Date(), reason);
  }
}
