import { CreateKitchenDto, UpdateKitchenStatusDto } from '../dto/kitchen.dto';

export const validateCreateKitchen = (dto: CreateKitchenDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.priorityMode) errors.push('priorityMode is required');
  if (!dto.timezone) errors.push('timezone is required');
  
  return errors;
};

export const validateUpdateKitchenStatus = (dto: UpdateKitchenStatusDto): string[] => {
  const errors: string[] = [];
  if (!dto.status) errors.push('status is required');
  return errors;
};
