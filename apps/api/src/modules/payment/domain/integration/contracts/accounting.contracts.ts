export interface SettlementCreated {
  paymentId: string;
  settlementReference: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface RefundRecorded {
  paymentId: string;
  refundId: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
}

export interface ChargebackRecorded {
  paymentId: string;
  chargebackId: string;
  captureReference: string;
  orderId: string;
  amount: number;
  currency: string;
  reason: string;
}
