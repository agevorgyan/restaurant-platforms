export interface PurchaseInvoiceLineDto {
  purchaseOrderLineId?: string;
  ingredientId: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface CreatePurchaseInvoiceDto {
  restaurantId: string;
  supplierId: string;
  purchaseOrderId?: string;
  goodsReceiptId?: string;
  invoiceNumber: string;
  supplierInvoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  currency: string;
  lines: PurchaseInvoiceLineDto[];
  notes?: string;
}
