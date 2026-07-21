export interface PaymentCompletedForAnalytics {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  completedAt: Date;
}

export interface RefundCompletedForAnalytics {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
  refundedAt: Date;
}
