import { TransactionAmount } from '../value-objects/transaction-amount.value-object';
import { TransactionReference, IdempotencyKey, TransactionType, TransactionStatus, FailureReason } from '../value-objects/transaction-strings.value-object';

export interface IPaymentTransaction {
  id: string;
  paymentId: string;
  transactionReference: TransactionReference;
  gatewayReference?: string;
  idempotencyKey: IdempotencyKey;
  transactionType: TransactionType;
  status: TransactionStatus;
  amount: TransactionAmount;
  failureReason?: FailureReason;
  metadata?: Record<string, any>;
  processedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
