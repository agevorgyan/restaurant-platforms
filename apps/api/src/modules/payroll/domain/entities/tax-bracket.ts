import { Entity, Identifier } from '@saas/domain';

export class TaxBracketId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxBracketId { return new TaxBracketId(value); }
  public static generate(): TaxBracketId { return new TaxBracketId(crypto.randomUUID()); }
}

export class TaxBracket extends Entity<TaxBracketId> {
  constructor(
    id: TaxBracketId,
    public readonly minIncome: number,
    public readonly maxIncome: number | null,
    public readonly rate: number,
    public readonly fixedAmount: number
  ) {
    super(id);
  }

  public static create(minIncome: number, maxIncome: number | null, rate: number, fixedAmount: number): TaxBracket {
    if (minIncome < 0 || (maxIncome !== null && maxIncome <= minIncome)) {
      throw new Error('Invalid tax bracket boundaries.');
    }
    return new TaxBracket(TaxBracketId.generate(), minIncome, maxIncome, rate, fixedAmount);
  }
}
