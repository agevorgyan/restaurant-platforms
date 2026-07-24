import { Entity, Identifier } from '@saas/domain';

export class RecurringBonusId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RecurringBonusId { return new RecurringBonusId(value); }
  public static generate(): RecurringBonusId { return new RecurringBonusId(crypto.randomUUID()); }
}

export class RecurringBonus extends Entity<RecurringBonusId> {
  constructor(
    id: RecurringBonusId,
    public readonly type: string,
    public readonly amount: number,
    public readonly condition?: string
  ) {
    super(id);
  }

  public static create(type: string, amount: number, condition?: string): RecurringBonus {
    if (amount < 0) throw new Error('Bonus amount cannot be negative.');
    return new RecurringBonus(RecurringBonusId.generate(), type, amount, condition);
  }
}
