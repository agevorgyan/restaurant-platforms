import { CreateCategoryDto, UpdateCategoryDto } from '../dto/category.dto';

export const validateCreateCategory = (dto: CreateCategoryDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.slug) errors.push('slug is required');
  if (dto.sortOrder === undefined || dto.sortOrder === null) errors.push('sortOrder is required');
  
  if (dto.visibility) {
    const valid = ['Public', 'Hidden', 'QR'];
    if (!valid.includes(dto.visibility)) {
      errors.push(`Invalid visibility: ${dto.visibility}`);
    }
  }

  return errors;
};

export const validateUpdateCategory = (dto: UpdateCategoryDto): string[] => {
  const errors: string[] = [];
  
  if (dto.status) {
    const valid = ['Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.visibility) {
    const valid = ['Public', 'Hidden', 'QR'];
    if (!valid.includes(dto.visibility)) {
      errors.push(`Invalid visibility: ${dto.visibility}`);
    }
  }

  return errors;
};
