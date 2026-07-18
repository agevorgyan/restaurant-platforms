import { GoodsReceiptStatus } from '../value-objects/goods-receipt-status.value-object';
import { ReceiptNumber } from '../value-objects/receipt-number.value-object';
import { ReceiptSource } from '../value-objects/receipt-source.value-object';
import { IGoodsReceiptLine } from './goods-receipt-line.interface';
import { IDomainEvent } from '../events/domain-event.interface';

export interface IGoodsReceipt {
  id: string;
  restaurantId: string;
  purchaseOrderId: string;
  receiptNumber: ReceiptNumber;
  status: GoodsReceiptStatus;
  receiptDate: Date;
  supplierDeliveryNote?: string;
  receivedBy: string;
  notes?: string;
  source: ReceiptSource;
  lines: IGoodsReceiptLine[];
  domainEvents?: IDomainEvent[];
  createdAt: Date;
  updatedAt: Date;
}
