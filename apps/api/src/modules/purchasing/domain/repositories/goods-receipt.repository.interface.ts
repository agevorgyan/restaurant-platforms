import { IGoodsReceipt } from '../entities/goods-receipt.interface';

export interface IGoodsReceiptRepository {
  findById(id: string): Promise<IGoodsReceipt | null>;
  findByReceiptNumber(restaurantId: string, receiptNumber: string): Promise<IGoodsReceipt | null>;
  save(goodsReceipt: IGoodsReceipt): Promise<void>;
}
