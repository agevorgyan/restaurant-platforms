export interface RestaurantIntegrationContract {
  // Provided to Restaurant Bounded Context to sync pricing boundaries
  restaurantId: string;
  currencyCode: string;
  defaultTaxPolicyId?: string;
  activePricingRulesCount: number;
}
