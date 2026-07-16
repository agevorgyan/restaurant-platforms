import { CreateMenuDto, UpdateMenuDto } from '../dto/menu.dto';

export const validateCreateMenu = (dto: CreateMenuDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.slug) errors.push('slug is required');
  if (!dto.defaultLanguage) errors.push('defaultLanguage is required');
  
  if (dto.visibility) {
    const valid = ['Public', 'Private', 'QR', 'Hidden'];
    if (!valid.includes(dto.visibility)) {
      errors.push(`Invalid visibility: ${dto.visibility}`);
    }
  }

  return errors;
};

export const validateUpdateMenu = (dto: UpdateMenuDto): string[] => {
  const errors: string[] = [];
  
  if (dto.status) {
    const valid = ['Draft', 'Published', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  if (dto.visibility) {
    const valid = ['Public', 'Private', 'QR', 'Hidden'];
    if (!valid.includes(dto.visibility)) {
      errors.push(`Invalid visibility: ${dto.visibility}`);
    }
  }

  return errors;
};
