// Interfaces representing external DTOs that ACL maps TO, from internal domain concepts.
export interface InventoryIncreaseRequestedContract { transactionId: string; [key: string]: any; }
export interface InventoryBatchRegistrationRequestedContract { batchId: string; [key: string]: any; }
export interface InventorySynchronizationRequestedContract { syncId: string; [key: string]: any; }
export interface AccountsPayableRequestedContract { payableId: string; [key: string]: any; }
export interface GoodsReceiptCompletedContract { receiptId: string; [key: string]: any; }
export interface ProcurementCompletedContract { workflowId: string; [key: string]: any; }
export interface SupplierPerformanceUpdatedContract { supplierId: string; [key: string]: any; }
export interface WorkflowCompletedContract { workflowId: string; [key: string]: any; }