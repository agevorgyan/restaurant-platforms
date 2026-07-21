export interface PaymentReceiptRequested {
  paymentId: string;
  orderId: string;
  customerEmail: string;
  amount: number;
  currency: string;
}

export interface PaymentFailureNotificationRequested {
  paymentId: string;
  orderId: string;
  customerEmail: string;
  reason: string;
}
