export type InventoryTypeUnion = 
  | 'MainWarehouse' 
  | 'KitchenStorage' 
  | 'BarStorage' 
  | 'Freezer' 
  | 'Refrigerator' 
  | 'DryStorage' 
  | 'SupplierConsignment' 
  | 'Custom';

export class InventoryType {
  constructor(public readonly value: InventoryTypeUnion) {
    if (!this.isValid(value)) {
      throw new Error(`Invalid inventory type: ${value}`);
    }
  }

  private isValid(value: string): value is InventoryTypeUnion {
    return [
      'MainWarehouse', 
      'KitchenStorage', 
      'BarStorage', 
      'Freezer', 
      'Refrigerator', 
      'DryStorage', 
      'SupplierConsignment', 
      'Custom'
    ].includes(value);
  }
}
