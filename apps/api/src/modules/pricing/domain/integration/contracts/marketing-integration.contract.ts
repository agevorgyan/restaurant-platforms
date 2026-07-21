export interface MarketingIntegrationContract {
  // Provided to Marketing Bounded Context
  campaignId: string;
  totalDiscountAmount: number;
  currencyCode: string;
  redemptionCount: number;
}
