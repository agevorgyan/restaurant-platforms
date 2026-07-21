import { Payment } from '../aggregates/payment.aggregate';

export interface IPaymentRepository {
  findById(id: string): Promise<Payment | null>;
  findByPaymentIntentId(paymentIntentId: string): Promise<Payment | null>;
  findByOrderId(orderId: string): Promise<Payment[]>;
  save(payment: Payment): Promise<void>;
}
