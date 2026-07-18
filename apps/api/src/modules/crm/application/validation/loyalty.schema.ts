import { CreateLoyaltyAccountDto, LoyaltyTransactionDto } from '../dto/loyalty.dto';

export function validateCreateLoyaltyAccount(dto: CreateLoyaltyAccountDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.customerId) errors.push('customerId is required');
  if (!dto.accountNumber) errors.push('accountNumber is required');
  return errors;
}

export function validateLoyaltyTransaction(dto: LoyaltyTransactionDto): string[] {
  const errors: string[] = [];
  if (!dto.reason || dto.reason.trim() === '') errors.push('reason is required');
  if (typeof dto.points !== 'number' || dto.points <= 0) errors.push('points must be greater than zero');
  return errors;
}
