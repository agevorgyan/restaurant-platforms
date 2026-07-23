import { GoodsReceiptId } from '../value-objects/goods-receipt-id.value-object';

export interface GoodsReceiptRepository {
  findById(id: GoodsReceiptId): Promise<any | null>;
  save(receipt: any): Promise<void>;
  delete(id: GoodsReceiptId): Promise<void>;
}
