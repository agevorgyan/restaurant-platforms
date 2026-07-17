import { CreateRefundDto, ApproveRefundDto, CompleteRefundDto } from '../dto/refund.dto';

export const validateCreateRefund = (dto: CreateRefundDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.paymentId) errors.push('paymentId is required');
  if (!dto.refundReference) errors.push('refundReference is required');
  if (!dto.reason) errors.push('reason is required');
  if (!dto.currency) errors.push('currency is required');
  if (!dto.requestedBy) errors.push('requestedBy is required');
  
  if (dto.amount === undefined || dto.amount === null) {
    errors.push('amount is required');
  } else if (!Number.isInteger(dto.amount) || dto.amount <= 0) {
    errors.push('amount must be a positive integer (minor units)');
  }
  
  return errors;
};

export const validateApproveRefund = (dto: ApproveRefundDto): string[] => {
  const errors: string[] = [];
  if (!dto.approvedBy) errors.push('approvedBy is required');
  return errors;
};

export const validateCompleteRefund = (dto: CompleteRefundDto): string[] => {
  const errors: string[] = [];
  if (!dto.transactionId) errors.push('transactionId is required');
  return errors;
};
