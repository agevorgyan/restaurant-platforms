import { Entity } from '@saas/core';
import { BatchNumber } from '../../value-objects/goods-receipt/batch-number.value-object';
import { LotNumber } from '../../value-objects/goods-receipt/lot-number.value-object';
import { ExpirationDate } from '../../value-objects/goods-receipt/expiration-date.value-object';

export interface BatchReceiptProps {
  lineId: string;
  batchNumber: BatchNumber;
  lotNumber?: LotNumber;
  expirationDate?: ExpirationDate;
  quantity: number;
}

export class BatchReceipt extends Entity<BatchReceiptProps> {
  get lineId(): string { return this.props.lineId; }
  get batchNumber(): BatchNumber { return this.props.batchNumber; }
  get lotNumber(): LotNumber | undefined { return this.props.lotNumber; }
  get expirationDate(): ExpirationDate | undefined { return this.props.expirationDate; }
  get quantity(): number { return this.props.quantity; }

  private constructor(id: string, props: BatchReceiptProps) { super(id, props); }

  public static create(props: BatchReceiptProps, id?: string): BatchReceipt {
    if (props.quantity <= 0) throw new Error('Batch quantity must be positive');
    return new BatchReceipt(id || crypto.randomUUID(), props);
  }
}