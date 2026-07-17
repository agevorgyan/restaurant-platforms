export type ReferenceTypeEnum = 
  | 'PurchaseOrder' 
  | 'GoodsReceipt' 
  | 'KitchenTicket' 
  | 'Recipe' 
  | 'ProductionBatch' 
  | 'InventoryAdjustment' 
  | 'StockCount' 
  | 'Manual' 
  | 'Other';

export class ReferenceType {
  constructor(public readonly value: ReferenceTypeEnum) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid reference type: ${value}`);
    }
  }

  private isValid(value: string): value is ReferenceTypeEnum {
    const types = [
      'PurchaseOrder', 'GoodsReceipt', 'KitchenTicket', 'Recipe', 
      'ProductionBatch', 'InventoryAdjustment', 'StockCount', 'Manual', 'Other'
    ];
    return types.includes(value);
  }
}
