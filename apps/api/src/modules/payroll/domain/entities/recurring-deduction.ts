import { Entity, Identifier } from '@saas/domain';

export class RecurringDeductionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): RecurringDeductionId { return new RecurringDeductionId(value); }
  public static generate(): RecurringDeductionId { return new RecurringDeductionId(crypto.randomUUID()); }
}

export class RecurringDeduction extends Entity<RecurringDeductionId> {
  constructor(
    id: RecurringDeductionId,
    public readonly type: string,
    public readonly amount: number,
    public readonly isMandatory: boolean
  ) {
    super(id);
  }

  public static create(type: string, amount: number, isMandatory: boolean): RecurringDeduction {
    if (amount < 0) throw new Error('Deduction amount cannot be negative.');
    return new RecurringDeduction(RecurringDeductionId.generate(), type, amount, isMandatory);
  }
}
