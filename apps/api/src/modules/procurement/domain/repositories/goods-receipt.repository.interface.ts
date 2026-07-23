import { GoodsReceiptId } from '../value-objects/goods-receipt-id.value-object';
import { GoodsReceipt } from '../aggregates/goods-receipt.aggregate';

export interface GoodsReceiptRepository {
  findById(id: GoodsReceiptId): Promise<GoodsReceipt | null>;
  save(receipt: GoodsReceipt): Promise<void>;
  delete(id: GoodsReceiptId): Promise<void>;
}
