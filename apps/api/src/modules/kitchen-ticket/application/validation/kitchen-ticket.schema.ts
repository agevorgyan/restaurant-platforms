import { CreateKitchenTicketDto } from '../dto/kitchen-ticket.dto';

export const validateCreateKitchenTicket = (dto: CreateKitchenTicketDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.branchId) errors.push('branchId is required');
  if (!dto.kitchenId) errors.push('kitchenId is required');
  if (!dto.orderId) errors.push('orderId is required');
  if (!dto.ticketNumber) errors.push('ticketNumber is required');
  if (!dto.priority) errors.push('priority is required');
  
  if (dto.estimatedPreparationTime === undefined || dto.estimatedPreparationTime === null) {
    errors.push('estimatedPreparationTime is required');
  } else if (!Number.isInteger(dto.estimatedPreparationTime) || dto.estimatedPreparationTime <= 0) {
    errors.push('estimatedPreparationTime must be an integer greater than zero');
  }

  if (!dto.items || dto.items.length === 0) {
    errors.push('A ticket must contain at least one item');
  } else {
    dto.items.forEach((item, index) => {
      if (!item.id) errors.push(`items[${index}].id is required`);
      if (!item.orderItemId) errors.push(`items[${index}].orderItemId is required`);
      if (!item.productSnapshot) errors.push(`items[${index}].productSnapshot is required`);
      if (item.quantity === undefined || item.quantity <= 0) {
        errors.push(`items[${index}].quantity must be greater than zero`);
      }
    });
  }
  
  return errors;
};
