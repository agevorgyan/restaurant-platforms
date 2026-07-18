import { GoodsReceiptStatus } from '../value-objects/goods-receipt-status.value-object';
import { ReceiptNumber } from '../value-objects/receipt-number.value-object';
import { IGoodsReceiptLine } from './goods-receipt-line.interface';

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
  lines: IGoodsReceiptLine[];
  createdAt: Date;
  updatedAt: Date;
}
