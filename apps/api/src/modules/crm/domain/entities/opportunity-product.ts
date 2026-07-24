import { Entity, Identifier } from '@saas/domain';

export class OpportunityProductId extends Identifier<string> {
  private constructor(value: string) { super(value); }
  public static create(value: string): OpportunityProductId { return new OpportunityProductId(value); }
  public static generate(): OpportunityProductId { return new OpportunityProductId(crypto.randomUUID()); }
}

export class OpportunityProduct extends Entity<OpportunityProductId> {
  constructor(
    id: OpportunityProductId,
    public readonly productId: string,
    public readonly quantity: number,
    public readonly unitPrice: number,
    public readonly discount: number
  ) {
    super(id);
  }

  public get totalPrice(): number {
    return (this.quantity * this.unitPrice) - this.discount;
  }

  public static create(productId: string, quantity: number, unitPrice: number, discount: number = 0): OpportunityProduct {
    if (quantity <= 0) throw new Error('Quantity must be greater than zero.');
    if (unitPrice < 0) throw new Error('Unit price cannot be negative.');
    if (discount < 0) throw new Error('Discount cannot be negative.');
    return new OpportunityProduct(OpportunityProductId.generate(), productId, quantity, unitPrice, discount);
  }
}
