import { CreatePaymentMethodDto, UpdatePaymentMethodStatusDto } from '../dto/payment-method.dto';

export const validateCreatePaymentMethod = (dto: CreatePaymentMethodDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.provider) errors.push('provider is required');
  if (!dto.paymentType) errors.push('paymentType is required');
  
  if (!dto.supportedCurrencies || dto.supportedCurrencies.length === 0) {
    errors.push('At least one supported currency is required');
  }
  
  if (!dto.supportedOrderTypes || dto.supportedOrderTypes.length === 0) {
    errors.push('At least one supported order type is required');
  }

  return errors;
};

export const validateUpdatePaymentMethodStatus = (dto: UpdatePaymentMethodStatusDto): string[] => {
  const errors: string[] = [];
  if (!dto.status) errors.push('status is required');
  return errors;
};
