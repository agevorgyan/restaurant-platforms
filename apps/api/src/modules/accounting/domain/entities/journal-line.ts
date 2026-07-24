import { Entity, Identifier } from '@saas/domain';

export class JournalLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): JournalLineId { return new JournalLineId(value); }
  public static generate(): JournalLineId { return new JournalLineId(crypto.randomUUID()); }
}

export abstract class JournalLine extends Entity<JournalLineId> {
  constructor(
    id: JournalLineId,
    public readonly accountId: string,
    public readonly amount: number,
    public readonly description: string
  ) {
    super(id);
    if (amount <= 0) throw new Error('Journal line amount must be strictly positive.');
  }
}

export class DebitEntry extends JournalLine {
  public static create(accountId: string, amount: number, description: string = ''): DebitEntry {
    return new DebitEntry(JournalLineId.generate(), accountId, amount, description);
  }
}

export class CreditEntry extends JournalLine {
  public static create(accountId: string, amount: number, description: string = ''): CreditEntry {
    return new CreditEntry(JournalLineId.generate(), accountId, amount, description);
  }
}
