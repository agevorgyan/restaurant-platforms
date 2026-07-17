import { CreatePromotionDto } from '../dto/promotion.dto';

export const validateCreatePromotion = (dto: CreatePromotionDto): string[] => {
  const errors: string[] = [];
  
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.code) errors.push('code is required');
  if (!dto.type) errors.push('type is required');
  if (!dto.reward) errors.push('reward is required');
  if (!dto.validity || !dto.validity.startDate) errors.push('validity.startDate is required');
  
  return errors;
};
