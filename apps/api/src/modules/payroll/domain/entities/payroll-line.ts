import { Entity, Identifier } from '@saas/domain';

export class PayrollLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollLineId { return new PayrollLineId(value); }
  public static generate(): PayrollLineId { return new PayrollLineId(crypto.randomUUID()); }
}

export class PayrollLine extends Entity<PayrollLineId> {
  constructor(
    id: PayrollLineId,
    public readonly description: string,
    public readonly amount: number,
    public readonly type: 'EARNING' | 'DEDUCTION' | 'TAX',
    public readonly currency: string
  ) {
    super(id);
  }

  public static create(description: string, amount: number, type: 'EARNING' | 'DEDUCTION' | 'TAX', currency: string = 'USD'): PayrollLine {
    return new PayrollLine(PayrollLineId.generate(), description, amount, type, currency);
  }
}
