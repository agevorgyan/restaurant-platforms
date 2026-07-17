export class CreatePaymentDto {
  restaurantId: string;
  orderId: string;
  paymentReference: string;
  paymentType: 'Cash' | 'Card' | 'Online' | 'GiftCard' | 'StoreCredit' | 'SplitPayment';
  amount: number; // minor units
  currency: string;
  description?: string;
  metadata?: Record<string, any>;
}

export class UpdatePaymentStatusDto {
  status: 'Pending' | 'Authorized' | 'Captured' | 'Cancelled' | 'Failed' | 'Refunded';
}
