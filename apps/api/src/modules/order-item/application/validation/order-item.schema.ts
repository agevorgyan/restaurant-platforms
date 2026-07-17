import { AddOrderItemDto, UpdateOrderItemDto } from '../dto/order-item.dto';

export const validateAddOrderItem = (dto: AddOrderItemDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.orderId) errors.push('orderId is required');
  if (!dto.productId) errors.push('productId is required');
  if (!dto.productSnapshot) errors.push('productSnapshot is required');
  
  if (dto.quantity === undefined || dto.quantity === null) {
    errors.push('quantity is required');
  } else if (dto.quantity <= 0) {
    errors.push('quantity must be greater than zero');
  }

  if (dto.unitPrice === undefined || dto.unitPrice === null) {
    errors.push('unitPrice is required');
  } else if (dto.unitPrice < 0) {
    errors.push('unitPrice cannot be negative');
  }

  return errors;
};

export const validateUpdateOrderItem = (dto: UpdateOrderItemDto): string[] => {
  const errors: string[] = [];
  
  if (dto.quantity !== undefined && dto.quantity <= 0) {
    errors.push('quantity must be greater than zero');
  }

  return errors;
};
