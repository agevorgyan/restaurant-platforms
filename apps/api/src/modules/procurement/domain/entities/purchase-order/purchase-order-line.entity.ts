import { Entity } from '@saas/core';
import { PurchaseOrderAmount } from '../../value-objects/purchase-order/purchase-order-amount.value-object';

export interface PurchaseOrderLineProps {
  itemId: string;
  description: string;
  quantity: number;
  unitPrice: PurchaseOrderAmount;
  totalPrice: PurchaseOrderAmount;
}

export class PurchaseOrderLine extends Entity<PurchaseOrderLineProps> {
  get itemId(): string { return this.props.itemId; }
  get description(): string { return this.props.description; }
  get quantity(): number { return this.props.quantity; }
  get unitPrice(): PurchaseOrderAmount { return this.props.unitPrice; }
  get totalPrice(): PurchaseOrderAmount { return this.props.totalPrice; }

  private constructor(id: string, props: PurchaseOrderLineProps) {
    super(id, props);
  }

  public static create(props: PurchaseOrderLineProps, id?: string): PurchaseOrderLine {
    if (props.quantity <= 0) throw new Error('Quantity must be positive');
    if (props.unitPrice.amount <= 0) throw new Error('Unit price must be positive');
    return new PurchaseOrderLine(id || crypto.randomUUID(), props);
  }
}