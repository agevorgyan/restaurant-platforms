import { IStockMovement } from '../entities/stock-movement.interface';

export interface IStockMovementRepository {
  findById(id: string): Promise<IStockMovement | null>;
  findByMovementNumber(movementNumber: string, restaurantId: string): Promise<IStockMovement | null>;
  save(movement: IStockMovement): Promise<void>;
}
