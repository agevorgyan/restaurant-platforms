import { CreateKitchenStationDto, UpdateKitchenStationStatusDto } from '../dto/kitchen-station.dto';

export const validateCreateKitchenStation = (dto: CreateKitchenStationDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.kitchenId) errors.push('kitchenId is required');
  if (!dto.name) errors.push('name is required');
  if (!dto.stationType) errors.push('stationType is required');
  
  if (dto.capacity === undefined || dto.capacity === null) {
    errors.push('capacity is required');
  } else if (!Number.isInteger(dto.capacity) || dto.capacity <= 0) {
    errors.push('capacity must be an integer greater than zero');
  }
  
  return errors;
};

export const validateUpdateKitchenStationStatus = (dto: UpdateKitchenStationStatusDto): string[] => {
  const errors: string[] = [];
  if (!dto.status) errors.push('status is required');
  return errors;
};
