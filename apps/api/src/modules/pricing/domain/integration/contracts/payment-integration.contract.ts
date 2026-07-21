export interface PaymentIntegrationContract {
  // Provided to Payment Bounded Context
  quotationId: string;
  chargeAmount: number;
  currencyCode: string;
  gatewayTransactionId?: string;
}
