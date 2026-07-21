export interface InventoryIntegrationContract {
  // Provided to Inventory Bounded Context
  productId: string;
  quantityHeld: number;
  quotationId: string;
}
