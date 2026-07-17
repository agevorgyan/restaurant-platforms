import { MovementQuantity } from '../value-objects/movement-quantity.value-object';

export interface IStockMovementLine {
  ingredientId: string;
  quantity: MovementQuantity;
  unitOfMeasure: string;
  lotNumber?: string;
  expirationDate?: Date;
}
