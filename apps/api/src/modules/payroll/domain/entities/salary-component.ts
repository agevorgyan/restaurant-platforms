import { Entity, Identifier } from '@saas/domain';

export class SalaryComponentId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): SalaryComponentId { return new SalaryComponentId(value); }
  public static generate(): SalaryComponentId { return new SalaryComponentId(crypto.randomUUID()); }
}

export class SalaryComponent extends Entity<SalaryComponentId> {
  constructor(
    id: SalaryComponentId,
    public readonly type: string,
    public readonly amount: number,
    public readonly currency: string
  ) {
    super(id);
  }

  public static create(type: string, amount: number, currency: string): SalaryComponent {
    if (amount < 0) throw new Error('Salary component amount cannot be negative.');
    return new SalaryComponent(SalaryComponentId.generate(), type, amount, currency);
  }
}
