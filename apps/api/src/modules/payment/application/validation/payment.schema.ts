import { CreatePaymentDto, UpdatePaymentStatusDto } from '../dto/payment.dto';

export const validateCreatePayment = (dto: CreatePaymentDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.orderId) errors.push('orderId is required');
  if (!dto.paymentReference) errors.push('paymentReference is required');
  if (!dto.paymentType) errors.push('paymentType is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (dto.amount === undefined || dto.amount === null) {
    errors.push('amount is required');
  } else if (!Number.isInteger(dto.amount) || dto.amount <= 0) {
    errors.push('amount must be a positive integer (minor units)');
  }
  
  return errors;
};

export const validateUpdatePaymentStatus = (dto: UpdatePaymentStatusDto): string[] => {
  const errors: string[] = [];
  if (!dto.status) errors.push('status is required');
  return errors;
};
