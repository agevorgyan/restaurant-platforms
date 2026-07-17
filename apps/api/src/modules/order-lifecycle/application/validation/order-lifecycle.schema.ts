import { TransitionOrderDto } from '../dto/order-lifecycle.dto';

export const validateTransitionOrder = (dto: TransitionOrderDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.orderId) errors.push('orderId is required');
  if (!dto.targetState) errors.push('targetState is required');
  
  return errors;
};
