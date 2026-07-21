export interface LoyaltyIntegrationContract {
  // Provided to Loyalty Bounded Context
  customerId: string;
  pointsEarned: number;
  pointsRedeemed: number;
  quotationId: string;
}
