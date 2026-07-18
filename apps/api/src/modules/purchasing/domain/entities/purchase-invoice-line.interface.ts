export interface IPurchaseInvoiceLine {
  purchaseOrderLineId?: string;
  ingredientId: string;
  description: string;
  quantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal: number;
}
