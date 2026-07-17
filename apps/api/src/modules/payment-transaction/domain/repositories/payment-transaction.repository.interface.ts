import { IPaymentTransaction } from '../entities/payment-transaction.interface';

export interface IPaymentTransactionRepository {
  findById(id: string): Promise<IPaymentTransaction | null>;
  findByReference(reference: string): Promise<IPaymentTransaction | null>;
  findByIdempotencyKey(key: string): Promise<IPaymentTransaction | null>;
  findByPaymentId(paymentId: string): Promise<IPaymentTransaction[]>;
  save(transaction: IPaymentTransaction): Promise<void>;
}
