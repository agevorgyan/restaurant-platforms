import { Entity, Identifier } from '@saas/domain';

export class AllowanceId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): AllowanceId { return new AllowanceId(value); }
  public static generate(): AllowanceId { return new AllowanceId(crypto.randomUUID()); }
}

export class Allowance extends Entity<AllowanceId> {
  constructor(
    id: AllowanceId,
    public readonly type: string,
    public readonly amount: number,
    public readonly isTaxable: boolean
  ) {
    super(id);
  }

  public static create(type: string, amount: number, isTaxable: boolean): Allowance {
    if (amount < 0) throw new Error('Allowance amount cannot be negative.');
    return new Allowance(AllowanceId.generate(), type, amount, isTaxable);
  }
}
