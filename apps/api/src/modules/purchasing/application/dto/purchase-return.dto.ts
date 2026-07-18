export interface PurchaseReturnLineDto {
  goodsReceiptLineId: string;
  ingredientId: string;
  returnedQuantity: number;
  acceptedReturnQuantity: number;
  unitOfMeasure: string;
  comment?: string;
}

export interface CreatePurchaseReturnDto {
  restaurantId: string;
  supplierId: string;
  goodsReceiptId: string;
  purchaseInvoiceId?: string;
  returnNumber: string;
  reason: string;
  returnDate: Date;
  notes?: string;
  lines: PurchaseReturnLineDto[];
}
