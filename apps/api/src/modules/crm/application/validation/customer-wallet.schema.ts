import { CreateWalletDto, WalletTransactionDto } from '../dto/customer-wallet.dto';

export function validateCreateWallet(dto: CreateWalletDto): string[] {
  const errors: string[] = [];
  if (!dto.restaurantId) errors.push('restaurantId is required');
  if (!dto.customerId) errors.push('customerId is required');
  if (!dto.walletNumber) errors.push('walletNumber is required');
  if (!dto.currency) errors.push('currency is required');
  return errors;
}

export function validateWalletTransaction(dto: WalletTransactionDto): string[] {
  const errors: string[] = [];
  if (typeof dto.amount !== 'number' || dto.amount <= 0) errors.push('Transaction amount must be greater than zero');
  if (!dto.reference || dto.reference.trim() === '') errors.push('Every transaction must contain a business reference');
  return errors;
}
