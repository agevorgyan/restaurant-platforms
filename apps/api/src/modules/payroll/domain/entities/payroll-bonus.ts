import { Entity, Identifier } from '@saas/domain';

export class PayrollBonusId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayrollBonusId { return new PayrollBonusId(value); }
  public static generate(): PayrollBonusId { return new PayrollBonusId(crypto.randomUUID()); }
}

export class PayrollBonus extends Entity<PayrollBonusId> {
  constructor(
    id: PayrollBonusId,
    public readonly type: string,
    public readonly amount: number,
    public readonly reason?: string
  ) {
    super(id);
  }

  public static create(type: string, amount: number, reason?: string): PayrollBonus {
    return new PayrollBonus(
      PayrollBonusId.generate(), 
      type, 
      amount, 
      reason
    );
  }
}
