export interface AnalyticsIntegrationContract {
  // Provided to Analytics Bounded Context
  eventName: string;
  quotationId: string;
  customerSegment?: string;
  cartSize: number;
  timestamp: string;
}
