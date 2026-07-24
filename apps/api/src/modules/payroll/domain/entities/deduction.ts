import { Entity, Identifier } from '@saas/domain';
import { DeductionAmount } from '../value-objects/money-types';

export class DeductionId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): DeductionId { return new DeductionId(value); }
  public static generate(): DeductionId { return new DeductionId(crypto.randomUUID()); }
}

export class Deduction extends Entity<DeductionId> {
  constructor(
    id: DeductionId,
    public readonly description: string,
    public readonly amount: DeductionAmount,
    public readonly isPreTax: boolean
  ) {
    super(id);
  }

  public static create(description: string, amount: DeductionAmount, isPreTax: boolean = false): Deduction {
    return new Deduction(DeductionId.generate(), description, amount, isPreTax);
  }
}
