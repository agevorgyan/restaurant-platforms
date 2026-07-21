import { PaymentIntent } from '../aggregates/payment-intent.aggregate';

export interface IPaymentIntentRepository {
  findById(id: string): Promise<PaymentIntent | null>;
  findByOrderId(orderId: string): Promise<PaymentIntent[]>;
  findByCheckoutSessionId(checkoutSessionId: string): Promise<PaymentIntent | null>;
  save(paymentIntent: PaymentIntent): Promise<void>;
}
