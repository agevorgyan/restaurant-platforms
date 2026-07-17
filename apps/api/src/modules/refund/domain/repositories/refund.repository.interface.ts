import { IRefund } from '../entities/refund.interface';

export interface IRefundRepository {
  findById(id: string): Promise<IRefund | null>;
  findByReference(restaurantId: string, reference: string): Promise<IRefund | null>;
  findByPaymentId(paymentId: string): Promise<IRefund[]>;
  save(refund: IRefund): Promise<void>;
}

export interface IRefundPolicy {
  getCapturedAmountForPayment(paymentId: string): Promise<{ captured: number, currency: string }>;
}
