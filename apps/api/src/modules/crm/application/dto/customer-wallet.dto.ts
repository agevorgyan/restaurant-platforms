export interface CreateWalletDto {
  restaurantId: string;
  customerId: string;
  walletNumber: string;
  currency: string;
}

export interface WalletTransactionDto {
  amount: number;
  reference: string;
  description?: string;
}
