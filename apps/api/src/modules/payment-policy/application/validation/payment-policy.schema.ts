import { CreatePaymentPolicyDto, UpdatePaymentPolicyStatusDto } from '../dto/payment-policy.dto';

export const validateCreatePaymentPolicy = (dto: CreatePaymentPolicyDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  
  if (!dto.allowedPaymentMethods || dto.allowedPaymentMethods.length === 0) {
    errors.push('At least one payment method must be enabled');
  }

  if (!dto.supportedCurrencies || dto.supportedCurrencies.length === 0) {
    errors.push('At least one supported currency is required');
  }

  if (!dto.limits) {
    errors.push('limits configuration is required');
  }

  if (!dto.splitPaymentPolicy) {
    errors.push('splitPaymentPolicy configuration is required');
  }

  if (!dto.timeoutPolicy) {
    errors.push('timeoutPolicy configuration is required');
  }

  if (!dto.retryPolicy) {
    errors.push('retryPolicy configuration is required');
  }

  return errors;
};

export const validateUpdatePaymentPolicyStatus = (dto: UpdatePaymentPolicyStatusDto): string[] => {
  const errors: string[] = [];
  if (!dto.status) errors.push('status is required');
  return errors;
};
