export interface CustomerIntegrationContract {
  // Provided to Customer Bounded Context
  customerId: string;
  loyaltyTier?: string;
  lifetimeValueOffset?: number;
}
