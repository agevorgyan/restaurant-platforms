export interface OrderIntegrationContract {
  // Provided to Order Bounded Context
  quotationId: string;
  orderId: string;
  totalAmount: number;
  currencyCode: string;
  pricingFingerprint: string;
  isValidated: boolean;
}
