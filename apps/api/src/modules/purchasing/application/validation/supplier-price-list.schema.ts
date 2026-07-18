import { CreateSupplierPriceListDto } from '../dto/supplier-price-list.dto';

export const validateCreateSupplierPriceList = (dto: CreateSupplierPriceListDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId || dto.restaurantId.trim() === '') errors.push('restaurantId is required');
  if (!dto.supplierId || dto.supplierId.trim() === '') errors.push('supplierId is required');
  if (!dto.name || dto.name.trim() === '') errors.push('name is required');
  if (!dto.currency || dto.currency.trim() === '') errors.push('currency is required');
  if (!(dto.validityStartDate instanceof Date) || isNaN(dto.validityStartDate.getTime())) errors.push('validityStartDate must be a valid date');
  if (!(dto.validityEndDate instanceof Date) || isNaN(dto.validityEndDate.getTime())) errors.push('validityEndDate must be a valid date');

  if (dto.validityStartDate && dto.validityEndDate && dto.validityStartDate >= dto.validityEndDate) {
    errors.push('validityStartDate must be before validityEndDate');
  }

  if (!Array.isArray(dto.items)) {
    errors.push('Price list must contain an array of items');
  } else {
    dto.items.forEach((item, index) => {
      if (!item.ingredientId || item.ingredientId.trim() === '') errors.push(`Item [${index}]: ingredientId is required`);
      if (typeof item.unitPrice !== 'number' || item.unitPrice <= 0) errors.push(`Item [${index}]: unitPrice must be greater than zero`);
      if (typeof item.minimumQuantity !== 'number' || item.minimumQuantity <= 0) errors.push(`Item [${index}]: minimumQuantity must be greater than zero`);
      if (typeof item.discountPercent !== 'number' || item.discountPercent < 0) errors.push(`Item [${index}]: discountPercent cannot be negative`);
    });
  }

  return errors;
};
