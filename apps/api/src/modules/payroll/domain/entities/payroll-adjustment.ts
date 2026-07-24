import { Entity, Identifier } from '@saas/domain';

export class PayrollAdjustmentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollAdjustmentId { return new PayrollAdjustmentId(value); }
  public static generate(): PayrollAdjustmentId { return new PayrollAdjustmentId(crypto.randomUUID()); }
}

export class PayrollAdjustment extends Entity<PayrollAdjustmentId> {
  constructor(
    id: PayrollAdjustmentId,
    public readonly type: 'ADDITION' | 'DEDUCTION',
    public readonly amount: number,
    public readonly reason: string
  ) {
    super(id);
  }

  public static create(type: 'ADDITION' | 'DEDUCTION', amount: number, reason: string): PayrollAdjustment {
    return new PayrollAdjustment(
      PayrollAdjustmentId.generate(), 
      type, 
      amount, 
      reason
    );
  }
}
