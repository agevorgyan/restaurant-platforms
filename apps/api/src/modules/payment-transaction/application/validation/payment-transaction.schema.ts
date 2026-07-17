import { CreatePaymentTransactionDto, FailPaymentTransactionDto } from '../dto/payment-transaction.dto';

export const validateCreatePaymentTransaction = (dto: CreatePaymentTransactionDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.paymentId) errors.push('paymentId is required');
  if (!dto.transactionReference) errors.push('transactionReference is required');
  if (!dto.idempotencyKey) errors.push('idempotencyKey is required');
  if (!dto.transactionType) errors.push('transactionType is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (dto.amount === undefined || dto.amount === null) {
    errors.push('amount is required');
  } else if (!Number.isInteger(dto.amount) || dto.amount <= 0) {
    errors.push('amount must be a positive integer (minor units)');
  }
  
  return errors;
};

export const validateFailPaymentTransaction = (dto: FailPaymentTransactionDto): string[] => {
  const errors: string[] = [];
  if (!dto.failureCode) errors.push('failureCode is required');
  if (!dto.failureMessage) errors.push('failureMessage is required');
  return errors;
};
