import { Entity, Identifier } from '@saas/domain';
import { BonusAmount } from '../value-objects/money-types';

export class BonusId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): BonusId { return new BonusId(value); }
  public static generate(): BonusId { return new BonusId(crypto.randomUUID()); }
}

export class Bonus extends Entity<BonusId> {
  constructor(
    id: BonusId,
    public readonly description: string,
    public readonly amount: BonusAmount,
    public readonly bonusDate: Date
  ) {
    super(id);
  }

  public static create(description: string, amount: BonusAmount, bonusDate: Date = new Date()): Bonus {
    return new Bonus(BonusId.generate(), description, amount, bonusDate);
  }
}
