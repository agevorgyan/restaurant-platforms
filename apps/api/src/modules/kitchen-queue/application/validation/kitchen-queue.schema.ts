import { CreateKitchenQueueDto, EnqueueTicketDto, ReorderTicketDto } from '../dto/kitchen-queue.dto';

export const validateCreateKitchenQueue = (dto: CreateKitchenQueueDto): string[] => {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.kitchenId) errors.push('kitchenId is required');
  if (!dto.stationId) errors.push('stationId is required');
  if (!dto.strategy) errors.push('strategy is required');
  
  if (dto.capacity === undefined || dto.capacity === null) {
    errors.push('capacity is required');
  } else if (!Number.isInteger(dto.capacity) || dto.capacity <= 0) {
    errors.push('capacity must be an integer greater than zero');
  }
  return errors;
};

export const validateEnqueueTicket = (dto: EnqueueTicketDto): string[] => {
  const errors: string[] = [];
  if (!dto.ticketId) errors.push('ticketId is required');
  if (!dto.priority) errors.push('priority is required');
  return errors;
};

export const validateReorderTicket = (dto: ReorderTicketDto): string[] => {
  const errors: string[] = [];
  if (!dto.ticketId) errors.push('ticketId is required');
  if (dto.newPosition === undefined || dto.newPosition === null || dto.newPosition < 0 || !Number.isInteger(dto.newPosition)) {
    errors.push('newPosition must be a non-negative integer');
  }
  return errors;
};
