import { IStockCount } from '../entities/stock-count.interface';

export interface IStockCountRepository {
  findById(id: string): Promise<IStockCount | null>;
  findByCountNumber(countNumber: string, restaurantId: string): Promise<IStockCount | null>;
  save(count: IStockCount): Promise<void>;
}
