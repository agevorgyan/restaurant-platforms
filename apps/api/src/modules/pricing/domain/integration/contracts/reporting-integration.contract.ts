export interface ReportingIntegrationContract {
  // Provided to Reporting Bounded Context
  restaurantId: string;
  dailyRevenueAmount: number;
  currencyCode: string;
  date: string;
}
