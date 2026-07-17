import { CountVariance } from '../value-objects/count-variance.value-object';

export interface IStockCountLine {
  ingredientId: string;
  expectedQuantity: number;
  countedQuantity: number;
  variance: CountVariance;
  unitOfMeasure: string;
  lotNumber?: string;
  expirationDate?: Date;
  comment?: string;
}
