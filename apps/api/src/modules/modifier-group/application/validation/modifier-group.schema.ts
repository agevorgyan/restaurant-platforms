import { CreateModifierGroupDto, UpdateModifierGroupDto } from '../dto/modifier-group.dto';

export const validateCreateModifierGroup = (dto: CreateModifierGroupDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.menuId) errors.push('menuId is required');
  if (!dto.name) errors.push('name is required');
  if (dto.sortOrder === undefined || dto.sortOrder === null) errors.push('sortOrder is required');
  
  if (!dto.selectionType) errors.push('selectionType is required');
  if (dto.minimumSelections === undefined || dto.minimumSelections === null) errors.push('minimumSelections is required');
  if (dto.maximumSelections === undefined || dto.maximumSelections === null) errors.push('maximumSelections is required');
  if (dto.isRequired === undefined || dto.isRequired === null) errors.push('isRequired is required');
  if (dto.allowMultipleSelections === undefined || dto.allowMultipleSelections === null) errors.push('allowMultipleSelections is required');

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  return errors;
};

export const validateUpdateModifierGroup = (dto: UpdateModifierGroupDto): string[] => {
  const errors: string[] = [];

  if (dto.status) {
    const valid = ['Draft', 'Active', 'Inactive', 'Archived'];
    if (!valid.includes(dto.status)) {
      errors.push(`Invalid status: ${dto.status}`);
    }
  }

  return errors;
};
