import { ValueObject } from '@saas/core';

export interface PurchaseOrderAmountProps { amount: number; }

export class PurchaseOrderAmount extends ValueObject<PurchaseOrderAmountProps> {
  get amount(): number { return this.props.amount; }
  private constructor(props: PurchaseOrderAmountProps) { super(props); }
  public static create(amount: number): PurchaseOrderAmount {
    if (amount < 0) throw new Error('PurchaseOrderAmount cannot be negative');
    return new PurchaseOrderAmount({ amount });
  }
  public static zero(): PurchaseOrderAmount { return new PurchaseOrderAmount({ amount: 0 }); }
}