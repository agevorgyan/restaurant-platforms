import { Entity, Identifier } from '@saas/domain';

export class TaxExemptionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): TaxExemptionId { return new TaxExemptionId(value); }
  public static generate(): TaxExemptionId { return new TaxExemptionId(crypto.randomUUID()); }
}

export class TaxExemption extends Entity<TaxExemptionId> {
  constructor(
    id: TaxExemptionId,
    public readonly code: string,
    public readonly name: string,
    public readonly amount: number,
    public readonly isPercentage: boolean,
    public readonly limitAmount: number | null
  ) {
    super(id);
  }

  public static create(code: string, name: string, amount: number, isPercentage: boolean, limitAmount: number | null): TaxExemption {
    if (amount < 0) throw new Error('Exemption amount cannot be negative.');
    return new TaxExemption(TaxExemptionId.generate(), code, name, amount, isPercentage, limitAmount);
  }
}
