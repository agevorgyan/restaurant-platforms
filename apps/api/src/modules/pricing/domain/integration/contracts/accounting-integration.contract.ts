export interface AccountingIntegrationContract {
  // Provided to Accounting Bounded Context
  transactionId: string;
  baseAmount: number;
  taxAmount: number;
  chargeAmount: number;
  discountAmount: number;
  currencyCode: string;
  recordedAt: string;
}
