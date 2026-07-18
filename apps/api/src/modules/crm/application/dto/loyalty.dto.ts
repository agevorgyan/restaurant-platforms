export interface CreateLoyaltyAccountDto {
  restaurantId: string;
  customerId: string;
  accountNumber: string;
}

export interface LoyaltyTransactionDto {
  reason: string;
  points: number;
  referenceType?: string;
  referenceId?: string;
}
