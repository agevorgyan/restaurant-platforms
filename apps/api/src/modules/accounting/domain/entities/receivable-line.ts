import { Entity, Identifier } from '@saas/domain';

export class ReceivableLineId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): ReceivableLineId { return new ReceivableLineId(value); }
  public static generate(): ReceivableLineId { return new ReceivableLineId(crypto.randomUUID()); }
}

export class ReceivableLine extends Entity<ReceivableLineId> {
  constructor(
    id: ReceivableLineId,
    public readonly description: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly totalAmount: number
  ) {
    super(id);
    if (quantity <= 0) throw new Error('Quantity must be positive.');
    if (unitPrice < 0) throw new Error('Unit price cannot be negative.');
  }

  public static create(description: string, quantity: number, unitPrice: number): ReceivableLine {
    const totalAmount = quantity * unitPrice;
    return new ReceivableLine(ReceivableLineId.generate(), description, quantity, unitPrice, totalAmount);
  }
}
