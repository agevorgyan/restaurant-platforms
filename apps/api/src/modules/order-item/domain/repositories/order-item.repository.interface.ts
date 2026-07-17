import { IOrderItem } from '../entities/order-item.interface';

export interface IOrderItemRepository {
  findById(id: string): Promise<IOrderItem | null>;
  findByOrderId(orderId: string): Promise<IOrderItem[]>;
  create(orderItem: IOrderItem): Promise<IOrderItem>;
  update(id: string, updates: Partial<IOrderItem>): Promise<IOrderItem>;
  remove(id: string): Promise<void>;
}
