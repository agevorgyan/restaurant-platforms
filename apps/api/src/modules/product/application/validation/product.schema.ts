import { CreateProductDto, UpdateProductDto } from '../dto/product.dto';

export const validateCreateProduct = (dto: CreateProductDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.categoryId) errors.push('categoryId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.slug) errors.push('slug is required');
  if (!dto.sku) errors.push('sku is required');
  if (dto.price === undefined || dto.price === null) errors.push('price is required');
  if (!dto.currency) errors.push('currency is required');
  
  if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
    errors.push('preparationTime cannot be negative');
  }

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.availability) {
    const valid = ['Available', 'Unavailable', 'OutOfStock', 'Hidden'];
    if (!valid.includes(dto.availability)) {
      errors.push(`Invalid availability: ${dto.availability}`);
    }
  }

  return errors;
};

export const validateUpdateProduct = (dto: UpdateProductDto): string[] => {
  const errors: string[] = [];
  
  if (dto.preparationTime !== undefined && dto.preparationTime < 0) {
    errors.push('preparationTime cannot be negative');
  }

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.availability) {
    const valid = ['Available', 'Unavailable', 'OutOfStock', 'Hidden'];
    if (!valid.includes(dto.availability)) {
      errors.push(`Invalid availability: ${dto.availability}`);
    }
  }

  return errors;
};
