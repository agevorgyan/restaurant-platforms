import { Entity } from '@saas/core';
import { ReceivedQuantity } from '../../value-objects/goods-receipt/received-quantity.value-object';
import { AcceptedQuantity } from '../../value-objects/goods-receipt/accepted-quantity.value-object';
import { RejectedQuantity } from '../../value-objects/goods-receipt/rejected-quantity.value-object';

export interface GoodsReceiptLineProps {
  purchaseOrderLineId: string;
  itemId: string;
  description: string;
  receivedQuantity: ReceivedQuantity;
  acceptedQuantity: AcceptedQuantity;
  rejectedQuantity: RejectedQuantity;
}

export class GoodsReceiptLine extends Entity<GoodsReceiptLineProps> {
  get purchaseOrderLineId(): string { return this.props.purchaseOrderLineId; }
  get itemId(): string { return this.props.itemId; }
  get description(): string { return this.props.description; }
  get receivedQuantity(): ReceivedQuantity { return this.props.receivedQuantity; }
  get acceptedQuantity(): AcceptedQuantity { return this.props.acceptedQuantity; }
  get rejectedQuantity(): RejectedQuantity { return this.props.rejectedQuantity; }

  private constructor(id: string, props: GoodsReceiptLineProps) { super(id, props); }

  public static create(props: GoodsReceiptLineProps, id?: string): GoodsReceiptLine {
    if (props.acceptedQuantity.amount + props.rejectedQuantity.amount !== props.receivedQuantity.amount) {
      throw new Error('Accepted and rejected quantities must equal received quantity');
    }
    return new GoodsReceiptLine(id || crypto.randomUUID(), props);
  }
}