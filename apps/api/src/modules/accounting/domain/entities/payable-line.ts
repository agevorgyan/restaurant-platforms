import { Entity, Identifier } from '@saas/domain';

export class PayableLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): PayableLineId { return new PayableLineId(value); }
  public static generate(): PayableLineId { return new PayableLineId(crypto.randomUUID()); }
}

export class PayableLine extends Entity<PayableLineId> {
  constructor(
    id: PayableLineId,
    public readonly description: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalAmount: number,
    public readonly expenseAccountId: string | null
  ) {
    super(id);
    if (quantity <= 0) throw new Error('Quantity must be positive.');
    if (unitPrice < 0) throw new Error('Unit price cannot be negative.');
  }

  public static create(description: string, quantity: number, unitPrice: number, expenseAccountId: string | null = null): PayableLine {
    const totalAmount = quantity * unitPrice;
    return new PayableLine(PayableLineId.generate(), description, quantity, unitPrice, totalAmount, expenseAccountId);
  }
}
