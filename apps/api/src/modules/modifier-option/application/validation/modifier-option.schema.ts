import { CreateModifierOptionDto, UpdateModifierOptionDto } from '../dto/modifier-option.dto';

export const validateCreateModifierOption = (dto: CreateModifierOptionDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.modifierGroupId) errors.push('modifierGroupId is required');
  if (!dto.name) errors.push('name is required');
  if (dto.sortOrder === undefined || dto.sortOrder === null) errors.push('sortOrder is required');
  if (dto.priceAdjustment === undefined || dto.priceAdjustment === null) errors.push('priceAdjustment is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (dto.maxQuantity === undefined || dto.maxQuantity === null) {
    errors.push('maxQuantity is required');
  } else if (dto.maxQuantity <= 0) {
    errors.push('maxQuantity must be greater than zero');
  }

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.availability) {
    const valid = ['Available', 'Unavailable', 'Hidden'];
    if (!valid.includes(dto.availability)) {
      errors.push(`Invalid availability: ${dto.availability}`);
    }
  }

  return errors;
};

export const validateUpdateModifierOption = (dto: UpdateModifierOptionDto): string[] => {
  const errors: string[] = [];

  if (dto.maxQuantity !== undefined && dto.maxQuantity !== null && dto.maxQuantity <= 0) {
    errors.push('maxQuantity must be greater than zero');
  }

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.availability) {
    const valid = ['Available', 'Unavailable', 'Hidden'];
    if (!valid.includes(dto.availability)) {
      errors.push(`Invalid availability: ${dto.availability}`);
    }
  }

  return errors;
};
