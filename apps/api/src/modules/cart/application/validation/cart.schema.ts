import { CreateCartDto, AddCartItemDto } from '../dto/cart.dto';

export const validateCreateCart = (dto: CreateCartDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (!dto.customerId && !dto.sessionId) {
    errors.push('At least one of customerId or sessionId is required');
  }

  return errors;
};

export const validateAddCartItem = (dto: AddCartItemDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.productId) errors.push('productId is required');
  
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
