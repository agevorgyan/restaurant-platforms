export interface GoodsReceiptLineDto {
  purchaseOrderLineId: string;
  ingredientId: string;
  orderedQuantity: number;
  receivedQuantity: number;
  acceptedQuantity: number;
  rejectedQuantity: number;
  unitOfMeasure: string;
  lotNumber?: string;
  expirationDate?: Date;
  comment?: string;
}

export interface CreateGoodsReceiptDto {
  restaurantId: string;
  purchaseOrderId: string;
  receiptNumber: string;
  receiptDate: Date;
  supplierDeliveryNote?: string;
  receivedBy: string;
  notes?: string;
  lines: GoodsReceiptLineDto[];
}
