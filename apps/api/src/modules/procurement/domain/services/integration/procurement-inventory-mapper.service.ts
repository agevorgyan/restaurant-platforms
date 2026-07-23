import { GoodsReceipt } from '../../aggregates/goods-receipt.aggregate';

export class ProcurementInventoryMapper {
  public mapGoodsReceiptToInventoryIncreaseRequest(goodsReceipt: GoodsReceipt): any {
    // Extracts quantities, warehouse info, and items into an intent payload
    // Does NOT calculate final inventory levels
    return {
      receiptId: goodsReceipt.id,
      warehouseId: goodsReceipt.warehouseReference?.warehouseId,
      items: goodsReceipt.lines.map(line => ({
        itemId: line.itemId,
        quantity: line.acceptedQuantity.amount
      }))
    };
  }
}