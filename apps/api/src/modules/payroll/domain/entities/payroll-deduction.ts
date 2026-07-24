import { Entity, Identifier } from '@saas/domain';

export class PayrollDeductionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollDeductionId { return new PayrollDeductionId(value); }
  public static generate(): PayrollDeductionId { return new PayrollDeductionId(crypto.randomUUID()); }
}

export class PayrollDeduction extends Entity<PayrollDeductionId> {
  constructor(
    id: PayrollDeductionId,
    public readonly type: string,
    public readonly amount: number,
    public readonly reason?: string
  ) {
    super(id);
  }

  public static create(type: string, amount: number, reason?: string): PayrollDeduction {
    return new PayrollDeduction(
      PayrollDeductionId.generate(), 
      type, 
      amount, 
      reason
    );
  }
}
