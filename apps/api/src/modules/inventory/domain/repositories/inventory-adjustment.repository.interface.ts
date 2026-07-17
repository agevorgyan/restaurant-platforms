import { IInventoryAdjustment } from '../entities/inventory-adjustment.interface';

export interface IInventoryAdjustmentRepository {
  findById(id: string): Promise<IInventoryAdjustment | null>;
  findByAdjustmentNumber(adjustmentNumber: string, restaurantId: string): Promise<IInventoryAdjustment | null>;
  save(adjustment: IInventoryAdjustment): Promise<void>;
}
