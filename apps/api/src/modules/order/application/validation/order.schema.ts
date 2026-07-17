import { CreateOrderDto, UpdateOrderDto } from '../dto/order.dto';

export const validateCreateOrder = (dto: CreateOrderDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.orderNumber) errors.push('orderNumber is required');
  if (!dto.orderType) errors.push('orderType is required');

  return errors;
};

export const validateUpdateOrder = (dto: UpdateOrderDto): string[] => {
  const errors: string[] = [];
  
  // Basic sanity validation if needed
  if (dto.orderType === '') errors.push('orderType cannot be empty');
  if (dto.status === '') errors.push('status cannot be empty');

  return errors;
};
