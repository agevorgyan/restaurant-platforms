import { CreateInventoryDto, UpdateInventoryDto } from '../dto/inventory.dto';

export const validateCreateInventory = (dto: CreateInventoryDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.name || dto.name.trim() === '') errors.push('Inventory name must not be empty');
  if (!dto.code || dto.code.trim() === '') errors.push('code is required');
  if (!dto.type) errors.push('type is required');
  if (!dto.location || dto.location.trim() === '') errors.push('Inventory location description must not be empty');
  if (typeof dto.capacity !== 'number' || dto.capacity <= 0) errors.push('Capacity must be greater than zero');
  return errors;
};

export const validateUpdateInventory = (dto: UpdateInventoryDto): string[] => {
  const errors: string[] = [];
  if (dto.name !== undefined && dto.name.trim() === '') errors.push('Inventory name must not be empty');
  if (dto.capacity !== undefined && (typeof dto.capacity !== 'number' || dto.capacity <= 0)) {
    errors.push('Capacity must be greater than zero');
  }
  return errors;
};
