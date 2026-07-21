export interface PaymentAuthorizationRequestedPayload {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethodId?: string;
  customerId?: string;
}

export interface PaymentAuthorizedPayload {
  orderId: string;
  transactionId: string;
  authorizedAt: Date;
}

export interface PaymentCapturedPayload {
  orderId: string;
  transactionId: string;
  capturedAt: Date;
}

export interface PaymentFailedPayload {
  orderId: string;
  reason: string;
  failedAt: Date;
}
