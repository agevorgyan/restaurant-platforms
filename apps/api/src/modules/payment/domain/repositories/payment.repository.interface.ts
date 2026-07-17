import { IPayment } from '../entities/payment.interface';

export interface IPaymentRepository {
  findById(id: string): Promise<IPayment | null>;
  findByReference(restaurantId: string, reference: string): Promise<IPayment | null>;
  findByOrderId(orderId: string): Promise<IPayment[]>;
  save(payment: IPayment): Promise<void>;
}
