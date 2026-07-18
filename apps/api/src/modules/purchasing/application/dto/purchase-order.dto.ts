export interface PurchaseOrderLineDto {
  ingredientId: string;
  description: string;
  orderedQuantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
}

export interface CreatePurchaseOrderDto {
  restaurantId: string;
  supplierId: string;
  purchaseOrderNumber: string;
  currency: string;
  expectedDeliveryDate?: Date;
  deliveryTerms?: string;
  lines: PurchaseOrderLineDto[];
  notes?: string;
}

export interface UpdatePurchaseOrderDto {
  currency?: string;
  expectedDeliveryDate?: Date;
  deliveryTerms?: string;
  lines?: PurchaseOrderLineDto[];
  notes?: string;
}

export interface ReceivePurchaseOrderLineDto {
  ingredientId: string;
  receivedQuantity: number;
}
