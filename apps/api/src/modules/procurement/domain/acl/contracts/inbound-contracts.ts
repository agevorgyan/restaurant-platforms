// Interfaces representing external DTOs. Procurement ACL translates these to internal domain concepts.
export interface InventoryUpdatedContract { inventoryId: string; [key: string]: any; }
export interface InventoryIncreaseCompletedContract { transactionId: string; [key: string]: any; }
export interface InventoryIncreaseRejectedContract { transactionId: string; reason: string; [key: string]: any; }
export interface InventoryBatchRegisteredContract { batchId: string; [key: string]: any; }
export interface InventorySynchronizationCompletedContract { syncId: string; [key: string]: any; }
export interface IngredientConsumptionRequestedContract { requestId: string; [key: string]: any; }
export interface InvoiceMatchedContract { invoiceId: string; [key: string]: any; }
export interface InvoiceRejectedContract { invoiceId: string; reason: string; [key: string]: any; }
export interface SupplierUpdatedContract { supplierId: string; [key: string]: any; }
export interface SupplierSuspendedContract { supplierId: string; [key: string]: any; }