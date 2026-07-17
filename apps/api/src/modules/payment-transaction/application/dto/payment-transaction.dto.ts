import { TransactionTypeEnum } from '../../domain/value-objects/transaction-strings.value-object';

export class CreatePaymentTransactionDto {
  paymentId: string;
  transactionReference: string;
  gatewayReference?: string;
  idempotencyKey: string;
  transactionType: TransactionTypeEnum;
  amount: number; // minor units
  currency: string;
  metadata?: Record<string, any>;
}

export class FailPaymentTransactionDto {
  failureCode: string;
  failureMessage: string;
}
