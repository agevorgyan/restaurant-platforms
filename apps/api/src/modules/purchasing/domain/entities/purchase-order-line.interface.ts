export interface IPurchaseOrderLine {
  ingredientId: string;
  description: string;
  orderedQuantity: number;
  receivedQuantity: number;
  unitOfMeasure: string;
  unitPrice: number;
  discount: number;
  taxRate: number;
  lineTotal: number;
}
