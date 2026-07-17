import { AdjustmentQuantity } from '../value-objects/adjustment-quantity.value-object';

export interface IInventoryAdjustmentLine {
  ingredientId: string;
  quantity: AdjustmentQuantity;
  unitOfMeasure: string;
  comment?: string;
}
