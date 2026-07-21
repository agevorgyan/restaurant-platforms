export interface PaymentAuthorizationRequested {
  paymentIntentId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentCaptureRequested {
  paymentId: string;
  amount: number;
  currency: string;
}

export interface PaymentVoidRequested {
  paymentId: string;
  reason: string;
}

export interface RefundRequested {
  paymentId: string;
  amount: number;
  currency: string;
  reason: string;
}

export interface PaymentAuthorized {
  paymentId: string;
  authorizationId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentCaptured {
  paymentId: string;
  captureId: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface PaymentPartiallyCaptured {
  paymentId: string;
  captureId: string;
  orderId: string;
  amount: number;
  currency: string;
  remainingAuthorizedAmount: number;
}

export interface PaymentFailed {
  paymentId: string;
  orderId: string;
  reason: string;
}

export interface PaymentVoided {
  paymentId: string;
  orderId: string;
  reason: string;
}

export interface PaymentRefunded {
  paymentId: string;
  refundId: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
}
