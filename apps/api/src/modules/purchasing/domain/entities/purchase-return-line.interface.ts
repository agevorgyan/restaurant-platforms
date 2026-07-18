export interface IPurchaseReturnLine {
  goodsReceiptLineId: string;
  ingredientId: string;
  returnedQuantity: number;
  acceptedReturnQuantity: number;
  unitOfMeasure: string;
  comment?: string;
}
