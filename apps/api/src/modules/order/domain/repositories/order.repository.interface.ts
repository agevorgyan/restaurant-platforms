import { IOrder } from '../entities/order.interface';

export interface IOrderRepository {
  findById(id: string): Promise<IOrder | null>;
  findByOrderNumber(restaurantId: string, orderNumber: string): Promise<IOrder | null>;
  create(order: IOrder): Promise<IOrder>;
  update(id: string, updates: Partial<IOrder>): Promise<IOrder>;
}
