import { Entity, Identifier } from '@saas/domain';

export class PayrollTaxId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollTaxId { return new PayrollTaxId(value); }
  public static generate(): PayrollTaxId { return new PayrollTaxId(crypto.randomUUID()); }
}

export class PayrollTax extends Entity<PayrollTaxId> {
  constructor(
    id: PayrollTaxId,
    public readonly type: string,
    public readonly amount: number,
    public readonly rate: number
  ) {
    super(id);
  }

  public static create(type: string, amount: number, rate: number): PayrollTax {
    return new PayrollTax(
      PayrollTaxId.generate(), 
      type, 
      amount, 
      rate
    );
  }
}
